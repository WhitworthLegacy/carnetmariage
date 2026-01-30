import React, { useState, useEffect } from "react";
import { APP_CONFIG } from "../../lib/config";

const FormVendor = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: APP_CONFIG.categories.vendors[0],
    price: 0,
    status: "contact",
    email: "",
  });

  useEffect(() => {
    if (initialData)
      setFormData({
        name: initialData.name || "",
        category: initialData.category || APP_CONFIG.categories.vendors[0],
        price: initialData.price || 0,
        status: initialData.status || "contact",
        email: initialData.email || "",
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
        <label>Nom du prestataire</label>
        <input
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          autoFocus
        />
      </div>
      <div className="field">
        <label>Catégorie</label>
        <select
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          {APP_CONFIG.categories.vendors.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Prix (€)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="field">
        <label>Statut</label>
        <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)}>
          {Object.entries(APP_CONFIG.statuses.vendors).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Email / Contact</label>
        <input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
      </div>
    </>
  );
};
export default FormVendor;
