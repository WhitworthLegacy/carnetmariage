import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Hero from './components/Hero';
import Toolbar from './components/Toolbar';
import Card from './components/Card';
import Modal from './components/Modal';

// Widgets
import WidgetTasks from './components/WidgetTasks';
import WidgetBudget from './components/WidgetBudget';
import WidgetVendors from './components/WidgetVendors';
import WidgetVenues from './components/WidgetVenues';
import WidgetGuests from './components/WidgetGuests';

// Formulaires (👇 NOUVEAU : On importe les 5 formulaires)
import FormTask from './components/forms/FormTask';
import FormBudget from './components/forms/FormBudget';
import FormVendor from './components/forms/FormVendor.jsx';
import FormVenue from './components/forms/FormVenue';
import FormGuest from './components/forms/FormGuest';

const WIDGET_TITLES = {
  tasks: "Organisation",
  budget: "Budget & Dépenses",
  vendors: "Mes Prestataires",
  venues: "Lieux & Salles",
  guests: "Liste des Invités"
};

function App() {
  const [user] = useState({ prenom1: "Sophie", prenom2: "Thomas", weddingDate: "2026-06-20" });
  const [progress, setProgress] = useState(0);
  
  const [tasks, setTasks] = useState([]);
  const [budget, setBudget] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [venues, setVenues] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... après const [loading, setLoading] = ...

  // 👇 NOUVEAU : CALCUL AUTOMATIQUE DE LA PROGRESSION
  useEffect(() => {
    // Si pas de tâches, 0%
    if (tasks.length === 0) {
      setProgress(0);
      return;
    }

    let score = 0;
    tasks.forEach(t => {
      if (t.status === 'done') score += 1;      // 100% du point
      if (t.status === 'doing') score += 0.5;   // 50% du point
    });

    // Règle de trois pour avoir le pourcentage
    const percentage = Math.round((score / tasks.length) * 100);
    setProgress(percentage);

  }, [tasks]); // 👈 Ce tableau veut dire : "Recalcule dès que 'tasks' change"

  // Gestion de la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [tempData, setTempData] = useState({}); 

// 👇 MODIFIÉ : Layout standard corrigé (Tâches 66% / Budget 33%)
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('wedding_layout');
    return saved ? JSON.parse(saved) : [
      { id: 'tasks', size: 'col-8' },    // Tâches (66%)
      { id: 'budget', size: 'col-4' },   // Budget (33%)
      { id: 'vendors', size: 'col-4' },  // Prestataires (33%)
      { id: 'venues', size: 'col-4' },   // Lieux (33%)
      { id: 'guests', size: 'col-4' }    // Invités (33%)
    ];
  });

  // 👇 Sauvegarde automatique à chaque changement
  useEffect(() => {
    localStorage.setItem('wedding_layout', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => { fetchAllData(); }, []);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [resTasks, resBudget, resVendors, resVenues, resGuests] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('budget').select('*'),
        supabase.from('vendors').select('*'),
        supabase.from('venues').select('*'),
        supabase.from('guests').select('*')
      ]);

      if (resTasks.data) setTasks(resTasks.data.map(t => ({ ...t, taskId: t.id })));
      if (resBudget.data) setBudget(resBudget.data.map(b => ({ ...b, lineId: b.id })));
      if (resVendors.data) setVendors(resVendors.data);
      if (resVenues.data) setVenues(resVenues.data);
      if (resGuests.data) setGuests(resGuests.data.map(g => ({ ...g, guestId: g.id })));

    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  }

  const openModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setTempData(item);
    } else {
      setTempData({});
    }
    setIsModalOpen(true);
  };

  // 👇 NOUVEAU : LA FONCTION QUI SAUVEGARDE TOUT (Tâches, Budget, etc.)
  const handleSave = async () => {
    setIsModalOpen(false);
    
    // Configuration intelligente pour gérer les 5 types
    const config = {
      tasks:   { table: 'tasks',   idField: 'taskId',  dbId: 'id', list: tasks,   setter: setTasks },
      budget:  { table: 'budget',  idField: 'lineId',  dbId: 'id', list: budget,  setter: setBudget },
      vendors: { table: 'vendors', idField: 'id',      dbId: 'id', list: vendors, setter: setVendors },
      venues:  { table: 'venues',  idField: 'id',      dbId: 'id', list: venues,  setter: setVenues },
      guests:  { table: 'guests',  idField: 'guestId', dbId: 'id', list: guests,  setter: setGuests },
    };

    const currentConfig = config[modalType];
    if (!currentConfig) return;

    try {
      // 1. On prépare les données (on enlève les IDs locaux pour pas embrouiller Supabase)
      const payload = { ...tempData };
      delete payload[currentConfig.idField];
      delete payload.id; 
      delete payload.created_at;

      const localId = tempData[currentConfig.idField]; // ex: récupère l'ID s'il existe
      
      if (localId) {
         // --- UPDATE (Mise à jour) ---
         const { error } = await supabase
           .from(currentConfig.table)
           .update(payload)
           .eq(currentConfig.dbId, localId);

         if (error) throw error;

         // Mise à jour de la liste locale
         currentConfig.setter(currentConfig.list.map(item => 
            item[currentConfig.idField] === localId ? { ...item, ...payload } : item
         ));

      } else {
         // --- CREATE (Création) ---
         const { data, error } = await supabase
           .from(currentConfig.table)
           .insert([payload])
           .select();

         if (error) throw error;

         if (data) {
           const newItem = { ...data[0], [currentConfig.idField]: data[0].id };
           currentConfig.setter([newItem, ...currentConfig.list]);
         }
      }

    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      alert("Erreur: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet élément ?")) return;

    // On reprend la même config intelligente que pour le Save
    const config = {
      tasks:   { table: 'tasks',   idField: 'taskId',  dbId: 'id', list: tasks,   setter: setTasks },
      budget:  { table: 'budget',  idField: 'lineId',  dbId: 'id', list: budget,  setter: setBudget },
      vendors: { table: 'vendors', idField: 'id',      dbId: 'id', list: vendors, setter: setVendors },
      venues:  { table: 'venues',  idField: 'id',      dbId: 'id', list: venues,  setter: setVenues },
      guests:  { table: 'guests',  idField: 'guestId', dbId: 'id', list: guests,  setter: setGuests },
    };

    const currentConfig = config[modalType];
    if (!currentConfig) return;

    const localId = tempData[currentConfig.idField]; // L'ID de l'élément à supprimer

    try {
      // 1. Suppression dans Supabase
      const { error } = await supabase
        .from(currentConfig.table)
        .delete()
        .eq(currentConfig.dbId, localId);

      if (error) throw error;

      // 2. Mise à jour locale (on filtre la liste pour retirer l'élément)
      currentConfig.setter(currentConfig.list.filter(item => item[currentConfig.idField] !== localId));
      
      setIsModalOpen(false);

    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression.");
    }
  };


  const addWidget = (id) => {
    if (!widgets.find(w => w.id === id)) setWidgets([...widgets, { id, size: 'col-6' }]);
  };
  const removeWidget = (id) => setWidgets(widgets.filter(w => w.id !== id));
// 👇 NOUVEAU : CYCLE DE TAILLE (33% -> 50% -> 66% -> 100% -> boucle)
  const resizeWidget = (id) => {
    setWidgets(widgets.map(w => {
      if (w.id === id) {
        let newSize = 'col-6'; // Valeur par défaut de sécurité
        
        // La logique du cycle
        if (w.size === 'col-4') newSize = 'col-6';       // 33%  -> 50%
        else if (w.size === 'col-6') newSize = 'col-8';  // 50%  -> 66%
        else if (w.size === 'col-8') newSize = 'col-12'; // 66%  -> 100%
        else if (w.size === 'col-12') newSize = 'col-4'; // 100% -> 33%
        
        return { ...w, size: newSize };
      }
      return w;
    }));
  };

  return (
    <div className="app-container">
      <Hero user={user} progress={progress} />
      <Toolbar onAddWidget={addWidget} activeWidgets={widgets.map(w => w.id)} />

      <div className="grid-container">
        {loading && <div className="grid-empty">Chargement...</div>}
        
        {!loading && widgets.map((widget) => (
          <Card 
            key={widget.id}
            title={WIDGET_TITLES[widget.id] || widget.id} 
            size={widget.size}
            onRemove={() => removeWidget(widget.id)}
            onResize={() => resizeWidget(widget.id)}
            onAddClick={() => openModal(widget.id)} 
          >
            {/* 👇 CORRECTION ICI : On connecte tous les clics et on ferme bien les balises */}
            {widget.id === 'tasks' && <WidgetTasks tasks={tasks} onTaskClick={(t) => openModal('tasks', t)} />}
            {widget.id === 'budget' && <WidgetBudget budgetLines={budget} onLineClick={(b) => openModal('budget', b)} />}
            {widget.id === 'vendors' && <WidgetVendors vendors={vendors} onVendorClick={(v) => openModal('vendors', v)} />}
            {widget.id === 'venues' && <WidgetVenues venues={venues} onVenueClick={(l) => openModal('venues', l)} />}
            {widget.id === 'guests' && <WidgetGuests guests={guests} onGuestClick={(g) => openModal('guests', g)} />}
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        title={tempData.id || tempData.taskId || tempData.lineId || tempData.guestId ? "Modifier" : "Ajouter"} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        // 👇 NOUVEAU : On passe la fonction Delete seulement si on a un ID (donc mode édition)
        onDelete={(tempData.id || tempData.taskId || tempData.lineId || tempData.guestId) ? handleDelete : null}
      >

        {/* 👇 NOUVEAU : On affiche le bon formulaire selon le type */}
        {modalType === 'tasks' && <FormTask onChange={(d) => setTempData({...tempData, ...d})} initialData={tempData.taskId ? tempData : null} />}
        {modalType === 'budget' && <FormBudget onChange={(d) => setTempData({...tempData, ...d})} initialData={tempData.lineId ? tempData : null} />}
        {modalType === 'vendors' && <FormVendor onChange={(d) => setTempData({...tempData, ...d})} initialData={tempData.id ? tempData : null} />}
        {modalType === 'venues' && <FormVenue onChange={(d) => setTempData({...tempData, ...d})} initialData={tempData.id ? tempData : null} />}
        {modalType === 'guests' && <FormGuest onChange={(d) => setTempData({...tempData, ...d})} initialData={tempData.guestId ? tempData : null} />}
      </Modal>
    </div>
  );
}

export default App;