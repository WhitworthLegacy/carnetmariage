import React, { useState, useEffect } from "react";
import { APP_CONFIG } from "../../lib/config";

const FormVenue = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: 0,
    status: "visit",
    capacity: 0,
  });

  useEffect(() => {
    if (initialData)
      setFormData({
        name: initialData.name || "",
        location: initialData.location || "",
        price: initialData.price || 0,
        status: initialData.status || "visit",
        capacity: initialData.capacity || 0,
      });
    onChange(initialData);
  }, [initialData]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <>
      <div className="field">
        <label>Nom du lieu</label>
        <input
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          autoFocus
        />
      </div>
      <div className="field">
        <label>Adresse / Ville</label>
        <input
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Prix (€)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Capacité (pers.)</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="field">
        <label>Statut</label>
        <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)}>
          {Object.entries(APP_CONFIG.statuses.venues).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
export default FormVenue;
