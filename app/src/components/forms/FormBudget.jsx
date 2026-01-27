import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../../lib/config';

const FormBudget = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState({
    label: '', estimated: 0, paid: 0, status: 'planned'
  });

  useEffect(() => {
    if (initialData) setFormData({
      label: initialData.label || '',
      estimated: initialData.estimated || 0,
      paid: initialData.paid || 0,
      status: initialData.status || 'planned'
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
      <div className="field"><label>Intitulé (ex: Traiteur)</label>
        <input value={formData.label} onChange={(e) => handleChange('label', e.target.value)} autoFocus />
      </div>
      <div style={{display:'flex', gap:10}}>
        <div className="field" style={{flex:1}}><label>Estimé (€)</label>
          <input type="number" value={formData.estimated} onChange={(e) => handleChange('estimated', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="field" style={{flex:1}}><label>Déjà Payé (€)</label>
          <input type="number" value={formData.paid} onChange={(e) => handleChange('paid', parseFloat(e.target.value) || 0)} />
        </div>
      </div>
      <div className="field"><label>Statut</label>
        <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
           {Object.entries(APP_CONFIG.statuses.budget).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>
    </>
  );
};
export default FormBudget;