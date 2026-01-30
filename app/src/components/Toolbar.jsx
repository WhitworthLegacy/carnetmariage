import React from "react";
import { ClipboardList, Wallet, Users, MapPin, Handshake, RefreshCw } from "lucide-react";

const Toolbar = ({ onAddWidget, activeWidgets }) => {
  // Liste des outils disponibles
  const tools = [
    { id: "tasks", label: "Tâches", icon: <ClipboardList size={16} /> },
    { id: "budget", label: "Budget", icon: <Wallet size={16} /> },
    { id: "vendors", label: "Prestataires", icon: <Handshake size={16} /> },
    { id: "venues", label: "Lieux", icon: <MapPin size={16} /> },
    { id: "guests", label: "Invités", icon: <Users size={16} /> },
  ];

  return (
    <div className="widget-toolbar">
      <div className="toolbar-title">Ajouter un bloc</div>

      {tools.map((tool) => {
        // On grise le bouton si le widget est déjà affiché
        const isDisabled = activeWidgets.includes(tool.id);

        return (
          <div
            key={tool.id}
            className={`lib-item ${isDisabled ? "disabled" : ""}`}
            onClick={() => !isDisabled && onAddWidget(tool.id)}
          >
            <span>{tool.icon}</span>
            {tool.label}
          </div>
        );
      })}
    </div>
  );
};

export default Toolbar;
