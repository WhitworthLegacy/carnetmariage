import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../../lib/config';

// On reçoit 'initialData' (les infos de la tâche cliquée)
const FormTask = ({ onChange, initialData }) => {
  
  const [formData, setFormData] = useState({
    title: '',
    category: APP_CONFIG.categories.tasks[0],
    status: 'todo',
    due_date: ''
  });

  // 👇 NOUVEAU : Si on a des données existantes, on remplit le formulaire
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || APP_CONFIG.categories.tasks[0],
        status: initialData.status || 'todo',
        due_date: initialData.due_date || ''
      });
      // Important : on prévient tout de suite la modale qu'on a des données
      onChange(initialData); 
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <>
      <div className="field">
        <label>Titre de la tâche</label>
        <input 
          type="text" 
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div className="field">
        <label>Catégorie</label>
        <select 
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          {APP_CONFIG.categories.tasks.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Date limite</label>
        <input 
          type="date"
          value={formData.due_date}
          onChange={(e) => handleChange('due_date', e.target.value)}
        />
      </div>
      
      {/* Petit bonus : Modifier le statut ici aussi si besoin */}
      <div className="field">
        <label>Statut</label>
        <select 
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
           {Object.entries(APP_CONFIG.statuses.tasks).map(([key, label]) => (
             <option key={key} value={key}>{label}</option>
           ))}
        </select>
      </div>
    </>
  );
};

export default FormTask;