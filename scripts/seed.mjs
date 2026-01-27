import { createClient } from '/Users/macbook/Dev/clients/carnetmariage/apps/web/node_modules/@supabase/supabase-js/dist/index.mjs';
import { readFileSync } from 'fs';

// ─── Supabase client ────────────────────────────────────────────────
const SUPABASE_URL = 'https://egtcoeimjhpsbawtpdzd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndGNvZWltamhwc2Jhd3RwZHpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY5MzY1MywiZXhwIjoyMDgzMjY5NjUzfQ.no_z4sTtJBMwWVh6QV4yWrflQEWkfgonqjG1471qLtU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Helpers ────────────────────────────────────────────────────────
function log(step, msg) {
  console.log(`[Step ${step}] ${msg}`);
}

function die(step, msg, err) {
  console.error(`[Step ${step}] ERROR: ${msg}`, err?.message ?? err);
  process.exit(1);
}

/** Create a user or return the existing one. */
async function ensureUser(email, password, full_name) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (!error) return data.user;

  // User may already exist – try to find them
  console.warn(`  createUser(${email}) failed: ${error.message} – looking up existing user...`);
  const { data: listData, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw listErr;
  const existing = listData.users.find((u) => u.email === email);
  if (!existing) throw new Error(`Could not find existing user ${email}`);
  return existing;
}

// ─── CSV parser (simple, handles quoted fields) ─────────────────────
function parseCSV(text) {
  const lines = text.replace(/^\uFEFF/, '').split('\n').filter(Boolean);
  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    const obj = {};
    headers.forEach((h, i) => (obj[h.trim()] = (values[i] ?? '').trim()));
    return obj;
  });
}

function parseLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function cleanPhone(raw) {
  if (!raw) return null;
  return raw.replace(/^\+/, '').replace(/[^\d]/g, '') || null;
}

// ═════════════════════════════════════════════════════════════════════
//  MAIN
// ═════════════════════════════════════════════════════════════════════
async function main() {
  console.log('=== CarnetMariage Seed Script ===\n');

  // ── Step 1: Create users ──────────────────────────────────────────
  log(1, 'Creating demo user...');
  const demoUser = await ensureUser('demo@carnetmariage.fr', 'Demo2025!', 'Marie & Thomas');
  const demoUserId = demoUser.id;
  log(1, `Demo user ID: ${demoUserId}`);

  log(1, 'Creating admin user...');
  const adminUser = await ensureUser('admin@carnetmariage.fr', 'Admin2025!', 'Admin CarnetMariage');
  const adminUserId = adminUser.id;
  log(1, `Admin user ID: ${adminUserId}`);

  // ── Step 2: Update admin profile role ─────────────────────────────
  log(2, 'Updating admin profile role...');
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', adminUserId);
  if (profileErr) die(2, 'Failed to update admin profile', profileErr);
  log(2, 'Admin profile role set to "admin".');

  // ── Step 3: Create wedding ────────────────────────────────────────
  log(3, 'Creating wedding for demo user...');
  const { data: wedding, error: weddingErr } = await supabase
    .from('weddings')
    .insert({
      owner_id: demoUserId,
      partner1_name: 'Marie',
      partner2_name: 'Thomas',
      wedding_date: '2026-09-12',
      total_budget: 25000,
      plan: 'free',
    })
    .select()
    .single();
  if (weddingErr) die(3, 'Failed to create wedding', weddingErr);
  const weddingId = wedding.id;
  log(3, `Wedding created – ID: ${weddingId}`);

  // ── Step 4: Import venues from CSV ────────────────────────────────
  log(4, 'Reading CSV...');
  const csvPath = '/Users/macbook/Dev/clients/carnetmariage/files/csv/Lieux_Salles.csv';
  const csvText = readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);
  log(4, `Parsed ${rows.length} rows from CSV.`);

  const venues = rows
    .filter((r) => r['Nom de la salle'])
    .map((r) => {
      let notes = r['Type'] || '';
      const site = r['Lien site'];
      if (site) notes += ` | Site: ${site}`;

      return {
        wedding_id: weddingId,
        name: r['Nom de la salle'],
        location: r['Ville / Région'] || null,
        status: 'visit',
        contact_phone: cleanPhone(r['Phone']),
        notes: notes.trim() || null,
        price: 0,
        capacity: 0,
      };
    });

  const { data: venueData, error: venueErr } = await supabase
    .from('venues')
    .insert(venues)
    .select();
  if (venueErr) die(4, 'Failed to insert venues', venueErr);
  log(4, `Inserted ${venueData.length} venues.`);

  // ── Step 5: Seed tasks ────────────────────────────────────────────
  log(5, 'Inserting tasks...');
  const tasks = [
    { title: 'Définir le budget total', category: 'Général', status: 'done', position: 0, due_date: '2025-10-01' },
    { title: "Créer la liste d'invités préliminaire", category: 'Général', status: 'done', position: 1, due_date: '2025-10-15' },
    { title: 'Choisir la date du mariage', category: 'Général', status: 'done', position: 2, due_date: '2025-09-15' },
    { title: 'Visiter les lieux présélectionnés', category: 'Lieu & Réception', status: 'doing', position: 3, due_date: '2026-01-30' },
    { title: 'Réserver le lieu de cérémonie', category: 'Lieu & Réception', status: 'todo', position: 4, due_date: '2026-03-01' },
    { title: 'Réserver le lieu de réception', category: 'Lieu & Réception', status: 'todo', position: 5, due_date: '2026-03-01' },
    { title: 'Demander des devis traiteurs', category: 'Traiteur & Boissons', status: 'doing', position: 6, due_date: '2026-02-15' },
    { title: 'Organiser la dégustation', category: 'Traiteur & Boissons', status: 'todo', position: 7, due_date: '2026-04-01' },
    { title: 'Choisir le gâteau de mariage', category: 'Traiteur & Boissons', status: 'todo', position: 8, due_date: '2026-05-01' },
    { title: 'Contacter des photographes', category: 'Photo & Vidéo', status: 'doing', position: 9, due_date: '2026-02-01' },
    { title: 'Réserver le photographe', category: 'Photo & Vidéo', status: 'todo', position: 10, due_date: '2026-03-15' },
    { title: 'Réserver le vidéaste', category: 'Photo & Vidéo', status: 'todo', position: 11, due_date: '2026-03-15' },
    { title: 'Choisir le DJ ou le groupe', category: 'Musique & Animation', status: 'todo', position: 12, due_date: '2026-04-01' },
    { title: 'Préparer la playlist', category: 'Musique & Animation', status: 'todo', position: 13, due_date: '2026-07-01' },
    { title: 'Essayer des robes de mariée', category: 'Tenues & Beauté', status: 'todo', position: 14, due_date: '2026-03-01' },
    { title: 'Commander le costume du marié', category: 'Tenues & Beauté', status: 'todo', position: 15, due_date: '2026-04-01' },
    { title: 'Choisir les alliances', category: 'Tenues & Beauté', status: 'todo', position: 16, due_date: '2026-05-01' },
    { title: 'Rencontrer des fleuristes', category: 'Fleurs & Décoration', status: 'todo', position: 17, due_date: '2026-04-15' },
    { title: 'Définir le thème déco', category: 'Fleurs & Décoration', status: 'todo', position: 18, due_date: '2026-03-01' },
    { title: 'Envoyer les save-the-date', category: 'Papeterie & Invitations', status: 'todo', position: 19, due_date: '2026-03-15' },
    { title: 'Commander les faire-part', category: 'Papeterie & Invitations', status: 'todo', position: 20, due_date: '2026-05-01' },
    { title: 'Envoyer les invitations', category: 'Papeterie & Invitations', status: 'todo', position: 21, due_date: '2026-06-01' },
    { title: 'Constituer le dossier mairie', category: 'Administratif', status: 'todo', position: 22, due_date: '2026-06-01' },
    { title: 'Préparer les voeux', category: 'Cérémonie', status: 'todo', position: 23, due_date: '2026-08-01' },
    { title: 'Planifier la lune de miel', category: 'Voyage de noces', status: 'todo', position: 24, due_date: '2026-06-15' },
  ];

  const tasksWithWedding = tasks.map((t) => ({ ...t, wedding_id: weddingId }));
  const { data: taskData, error: taskErr } = await supabase
    .from('tasks')
    .insert(tasksWithWedding)
    .select();
  if (taskErr) die(5, 'Failed to insert tasks', taskErr);
  log(5, `Inserted ${taskData.length} tasks.`);

  // ── Step 6: Seed vendors ──────────────────────────────────────────
  log(6, 'Inserting vendors...');
  const vendors_list = [
    { name: 'Studio Lumière', category: 'Photographe', status: 'quote', price: 2500, email: 'contact@studiolumiere.fr', website: 'https://studiolumiere.fr', notes: 'Portfolio excellent, style reportage' },
    { name: 'Chef Antoine Traiteur', category: 'Traiteur', status: 'meeting', price: 8500, email: 'info@chefantoine.be', phone: '+32478123456', notes: 'Cuisine gastronomique franco-belge' },
    { name: 'DJ Max Events', category: 'DJ / Musique', status: 'contact', price: 1200, email: 'djmax@events.be', notes: 'Recommandé par des amis' },
    { name: "Fleurs d'Élise", category: 'Fleuriste', status: 'quote', price: 1800, email: 'elise@fleursdelise.be', website: 'https://fleursdelise.be', notes: 'Spécialiste mariage champêtre' },
    { name: 'Vidéo Emotion', category: 'Vidéaste', status: 'contact', price: 2000, email: 'hello@videoemotion.fr', notes: 'Style cinématographique' },
    { name: 'La Pâtissière', category: 'Traiteur', status: 'booked', price: 650, email: 'commande@lapatissiere.be', notes: 'Wedding cake 3 étages vanille-framboise' },
    { name: 'Belle en Blanc', category: 'Robe de mariée', status: 'meeting', price: 3200, phone: '+32489654321', notes: 'Rendez-vous essayage le 15 mars' },
    { name: 'Sono Pro Belgium', category: 'DJ / Musique', status: 'contact', price: 900, email: 'info@sonopro.be', notes: 'Alternative DJ, bon rapport qualité-prix' },
  ];

  const vendorsWithWedding = vendors_list.map((v) => ({ ...v, wedding_id: weddingId }));
  const { data: vendorData, error: vendorErr } = await supabase
    .from('vendors')
    .insert(vendorsWithWedding)
    .select();
  if (vendorErr) die(6, 'Failed to insert vendors', vendorErr);
  log(6, `Inserted ${vendorData.length} vendors.`);

  // ── Step 7: Seed budget lines ─────────────────────────────────────
  log(7, 'Inserting budget lines...');
  const budgetLines = [
    { label: 'Lieu de réception', category: 'Lieu & Réception', estimated: 5000, paid: 0, status: 'planned' },
    { label: 'Traiteur (repas + boissons)', category: 'Traiteur & Boissons', estimated: 8500, paid: 500, status: 'booked', notes: 'Acompte versé' },
    { label: 'Photographe', category: 'Photo & Vidéo', estimated: 2500, paid: 0, status: 'planned' },
    { label: 'Vidéaste', category: 'Photo & Vidéo', estimated: 2000, paid: 0, status: 'planned' },
    { label: 'DJ', category: 'Musique & Animation', estimated: 1200, paid: 0, status: 'planned' },
    { label: 'Robe de mariée', category: 'Tenues & Beauté', estimated: 3200, paid: 800, status: 'booked', notes: 'Acompte 25%' },
    { label: 'Costume marié', category: 'Tenues & Beauté', estimated: 800, paid: 0, status: 'planned' },
    { label: 'Fleurs & Décoration', category: 'Fleurs & Décoration', estimated: 1800, paid: 0, status: 'planned' },
    { label: 'Alliances', category: 'Tenues & Beauté', estimated: 1500, paid: 0, status: 'planned' },
    { label: 'Wedding cake', category: 'Traiteur & Boissons', estimated: 650, paid: 650, status: 'paid', notes: 'Réglé en totalité' },
    { label: 'Faire-part & papeterie', category: 'Papeterie & Invitations', estimated: 400, paid: 0, status: 'planned' },
    { label: 'Voyage de noces', category: 'Voyage de noces', estimated: 4000, paid: 0, status: 'planned' },
  ];

  const budgetWithWedding = budgetLines.map((b) => ({ ...b, wedding_id: weddingId }));
  const { data: budgetData, error: budgetErr } = await supabase
    .from('budget_lines')
    .insert(budgetWithWedding)
    .select();
  if (budgetErr) die(7, 'Failed to insert budget lines', budgetErr);
  log(7, `Inserted ${budgetData.length} budget lines.`);

  // ── Step 8: Seed guests ───────────────────────────────────────────
  log(8, 'Inserting guests...');
  const guests = [
    { name: 'Sophie & Julien Dupont', email: 'sophie.dupont@gmail.com', adults: 2, kids: 1, status: 'confirmed', group_name: 'Famille mariée' },
    { name: 'Marc Lemaire', email: 'marc.lemaire@outlook.com', adults: 1, kids: 0, status: 'confirmed', group_name: 'Amis marié' },
    { name: 'Camille & Rémi Bernard', adults: 2, kids: 0, status: 'confirmed', group_name: 'Amis communs' },
    { name: 'Nathalie Petit', email: 'nathalie.p@yahoo.fr', adults: 1, kids: 0, status: 'pending', group_name: 'Famille marié' },
    { name: 'Jean-Pierre & Marie-Claire Martin', adults: 2, kids: 0, status: 'confirmed', group_name: 'Famille mariée', dietary_notes: 'Sans gluten' },
    { name: 'Lucas Moreau', adults: 1, kids: 0, status: 'pending', group_name: 'Amis marié', plus_one: true },
    { name: 'Isabelle & François Laurent', adults: 2, kids: 2, status: 'confirmed', group_name: 'Famille marié' },
    { name: 'Charlotte Mercier', adults: 1, kids: 0, status: 'declined', group_name: 'Collègues', notes: 'En voyage ce jour-là' },
    { name: 'Ahmed & Fatima Benali', adults: 2, kids: 1, status: 'confirmed', group_name: 'Amis communs' },
    { name: 'Pierre Roux', adults: 1, kids: 0, status: 'pending', group_name: 'Amis marié' },
    { name: 'Marie-Louise Dubois', adults: 1, kids: 0, status: 'confirmed', group_name: 'Famille mariée', dietary_notes: 'Végétarienne' },
    { name: 'Stéphane & Claire Leroy', adults: 2, kids: 0, status: 'maybe', group_name: 'Collègues' },
    { name: 'Olivier Girard', adults: 1, kids: 0, status: 'pending', group_name: 'Amis marié', plus_one: true },
    { name: 'Emma & Thomas Morel', adults: 2, kids: 1, status: 'confirmed', group_name: 'Amis communs' },
    { name: 'Jacques Martin', adults: 1, kids: 0, status: 'confirmed', group_name: 'Famille marié' },
    { name: 'Aline Van der Berg', email: 'aline.vdb@gmail.com', adults: 1, kids: 0, status: 'pending', group_name: 'Amis mariée' },
    { name: 'David & Sarah Cohen', adults: 2, kids: 2, status: 'confirmed', group_name: 'Amis communs', dietary_notes: 'Casher' },
    { name: 'Martine Lefebvre', adults: 1, kids: 0, status: 'declined', group_name: 'Famille mariée', notes: 'Problème de santé' },
    { name: 'Youssef & Amira Khalil', adults: 2, kids: 0, status: 'confirmed', group_name: 'Collègues', dietary_notes: 'Halal' },
    { name: 'Brigitte & Paul Fontaine', adults: 2, kids: 0, status: 'pending', group_name: 'Famille marié' },
  ];

  const guestsWithWedding = guests.map((g) => ({ ...g, wedding_id: weddingId }));
  const { data: guestData, error: guestErr } = await supabase
    .from('guests')
    .insert(guestsWithWedding)
    .select();
  if (guestErr) die(8, 'Failed to insert guests', guestErr);
  log(8, `Inserted ${guestData.length} guests.`);

  // ── Done ──────────────────────────────────────────────────────────
  console.log('\n=== Seed complete! ===');
  console.log(`  Demo user:  demo@carnetmariage.fr  (ID: ${demoUserId})`);
  console.log(`  Admin user: admin@carnetmariage.fr (ID: ${adminUserId})`);
  console.log(`  Wedding ID: ${weddingId}`);
  console.log(`  Venues: ${venueData.length} | Tasks: ${taskData.length} | Vendors: ${vendorData.length}`);
  console.log(`  Budget lines: ${budgetData.length} | Guests: ${guestData.length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
