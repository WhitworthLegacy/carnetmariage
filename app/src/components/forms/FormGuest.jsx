import React, { useState, useEffect } from "react";
import { APP_CONFIG } from "../../lib/config";

const FormGuest = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    adults: 1,
    kids: 0,
    status: "pending",
  });

  useEffect(() => {
    if (initialData)
      setFormData({
        name: initialData.name || "",
        adults: initialData.adults || 1,
        kids: initialData.kids || 0,
        status: initialData.status || "pending",
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
        <label>Nom (Famille / Couple)</label>
        <input
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          autoFocus
        />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Adultes</label>
          <input
            type="number"
            value={formData.adults}
            onChange={(e) => handleChange("adults", parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Enfants</label>
          <input
            type="number"
            value={formData.kids}
            onChange={(e) => handleChange("kids", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="field">
        <label>Statut</label>
        <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)}>
          {Object.entries(APP_CONFIG.statuses.guests).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
export default FormGuest;
