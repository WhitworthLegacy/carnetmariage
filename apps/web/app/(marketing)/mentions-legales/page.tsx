export default function MentionsLegalesPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight mb-12">
          Mentions légales
        </h1>

        <div className="prose prose-sm max-w-none space-y-10">
          {/* Éditeur */}
          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">Éditeur du site</h2>
            <div className="bg-white rounded-2xl border border-brand-border p-6 text-sm text-muted leading-relaxed space-y-2">
              <p>
                <strong className="text-ink">CarnetMariage</strong>
              </p>
              <p>SAS au capital de 1 000 euros</p>
              <p>Siège social : Paris, France</p>
              <p>
                Email :{" "}
                <a
                  href="mailto:contact@carnetmariage.fr"
                  className="text-pink-dark hover:text-pink-main"
                >
                  contact@carnetmariage.fr
                </a>
              </p>
              <p>Directeur de la publication : [Nom du directeur]</p>
              <p>SIRET : [Numéro SIRET]</p>
              <p>TVA intracommunautaire : [Numéro TVA]</p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">Hébergement</h2>
            <div className="bg-white rounded-2xl border border-brand-border p-6 text-sm text-muted leading-relaxed space-y-2">
              <p>
                Le site est hébergé par <strong className="text-ink">Vercel Inc.</strong>
              </p>
              <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p>
                Les données sont stockées par <strong className="text-ink">Supabase Inc.</strong>{" "}
                sur des serveurs situés dans l'Union européenne.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section id="confidentialite">
            <h2 className="font-serif text-2xl text-ink mb-4">
              Données personnelles & Confidentialité
            </h2>
            <div className="bg-white rounded-2xl border border-brand-border p-6 text-sm text-muted leading-relaxed space-y-4">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez des droits
                suivants concernant vos données personnelles :
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement (droit à l'oubli) de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p>
                <strong className="text-ink">Données collectées :</strong> Nous collectons
                uniquement les données nécessaires au fonctionnement du service : adresse email,
                prénom, informations relatives à l'organisation de votre mariage (invités, budget,
                prestataires).
              </p>
              <p>
                <strong className="text-ink">Finalité :</strong> Les données sont utilisées
                exclusivement pour fournir le service CarnetMariage et améliorer l'expérience
                utilisateur.
              </p>
              <p>
                <strong className="text-ink">Durée de conservation :</strong> Vos données sont
                conservées pendant toute la durée de votre compte et pendant 3 ans après sa
                suppression.
              </p>
              <p>
                <strong className="text-ink">Sous-traitants :</strong> Nous faisons appel à Supabase
                (hébergement et base de données), Vercel (hébergement web), et Stripe (paiements).
                Ces prestataires respectent le RGPD.
              </p>
              <p>
                Pour exercer vos droits, contactez-nous à{" "}
                <a
                  href="mailto:contact@carnetmariage.fr"
                  className="text-pink-dark hover:text-pink-main"
                >
                  contact@carnetmariage.fr
                </a>
                . Vous disposez également du droit d'introduire une réclamation auprès de la CNIL.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">Cookies</h2>
            <div className="bg-white rounded-2xl border border-brand-border p-6 text-sm text-muted leading-relaxed space-y-4">
              <p>
                Le site utilise des cookies strictement nécessaires au fonctionnement du service
                (authentification, préférences de session).
              </p>
              <p>
                <strong className="text-ink">Cookies essentiels (obligatoires) :</strong> Ces
                cookies sont indispensables au fonctionnement du site. Ils permettent de maintenir
                votre session et d'assurer la sécurité de votre connexion.
              </p>
              <p>
                <strong className="text-ink">Cookies analytiques :</strong> Nous pouvons utiliser
                des outils d'analyse anonymes pour comprendre comment le site est utilisé et
                améliorer l'expérience. Ces cookies sont soumis à votre consentement.
              </p>
              <p>
                Vous pouvez configurer votre navigateur pour refuser les cookies non essentiels.
                Cependant, cela pourrait affecter certaines fonctionnalités du site.
              </p>
            </div>
          </section>

          {/* CGV */}
          <section id="cgv">
            <h2 className="font-serif text-2xl text-ink mb-4">Conditions Générales de Vente</h2>
            <div className="bg-white rounded-2xl border border-brand-border p-6 text-sm text-muted leading-relaxed space-y-4">
              <p>
                <strong className="text-ink">Objet :</strong> Les présentes conditions régissent
                l'utilisation du service CarnetMariage, accessible via le site carnetmariage.fr et
                ses applications.
              </p>
              <p>
                <strong className="text-ink">Plans et tarification :</strong> CarnetMariage propose
                un plan gratuit et des plans payants (Premium, Ultimate). Les tarifs sont indiqués
                en euros TTC sur la page Tarifs.
              </p>
              <p>
                <strong className="text-ink">Paiement :</strong> Les paiements sont gérés par
                Stripe. Les abonnements sont renouvelés automatiquement. Vous pouvez annuler à tout
                moment depuis votre espace client.
              </p>
              <p>
                <strong className="text-ink">Droit de rétractation :</strong> Conformément à
                l'article L221-28 du Code de la consommation, l'accès immédiat au service numérique
                peut exclure le droit de rétractation, sous réserve de votre accord exprès.
              </p>
              <p>
                <strong className="text-ink">Limitation de responsabilité :</strong> CarnetMariage
                s'engage à fournir un service de qualité mais ne saurait être tenu responsable des
                dommages indirects liés à l'utilisation du service.
              </p>
              <p>
                <strong className="text-ink">Droit applicable :</strong> Les présentes conditions
                sont soumises au droit français. Tout litige sera porté devant les tribunaux
                compétents de Paris.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">Contact</h2>
            <div className="bg-white rounded-2xl border border-brand-border p-6 text-sm text-muted leading-relaxed">
              <p>
                Pour toute question relative aux présentes mentions légales, vous pouvez nous
                contacter à{" "}
                <a
                  href="mailto:contact@carnetmariage.fr"
                  className="text-pink-dark hover:text-pink-main"
                >
                  contact@carnetmariage.fr
                </a>{" "}
                ou via notre{" "}
                <a href="/contact" className="text-pink-dark hover:text-pink-main">
                  page de contact
                </a>
                .
              </p>
            </div>
          </section>
        </div>

        <p className="mt-12 text-xs text-muted-light text-center">
          Dernière mise à jour : janvier 2026
        </p>
      </div>
    </section>
  );
}
