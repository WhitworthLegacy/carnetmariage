import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react"; // On utilise les jolies icônes

const Card = ({ title, children, size = "col-6", onRemove, onResize, onAddClick }) => {
  return (
    <div className={`card ${size}`}>
      <div className="cardTop">
        <h2>{title}</h2>
        <div className="card-actions-top">
          {onAddClick && (
            <button className="btnPrimary btnIcon" onClick={onAddClick} title="Ajouter">
              +
            </button>
          )}

          <button className="card-btn-small" onClick={onResize} title="Agrandir">
            <Maximize2 size={14} />
          </button>

          {/* Bouton Fermer */}
          <button className="card-btn-small close" onClick={onRemove} title="Retirer">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Ici, on insère le contenu spécifique (Tâches, Budget...) */}
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
