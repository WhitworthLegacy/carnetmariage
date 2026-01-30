import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, isOpen, onClose, onSave, onDelete, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show" style={{ display: "grid" }}>
      <div style={{ position: "absolute", inset: 0 }} onClick={onClose}></div>

      <div className="modalBox" style={{ zIndex: 10 }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn-close-x" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div id="modalBody">{children}</div>

        {/* 👇 NOUVEAU LAYOUT DES BOUTONS */}
        <div className="acts" style={{ justifyContent: onDelete ? "space-between" : "flex-end" }}>
          {/* Si on nous donne une fonction onDelete, on affiche le bouton rouge */}
          {onDelete && (
            <button className="btn-modal btn-delete" onClick={onDelete}>
              Supprimer
            </button>
          )}

          {/* Groupe Annuler/Enregistrer à droite */}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-modal btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button className="btn-modal btn-save" onClick={onSave}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
