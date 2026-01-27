import React from 'react';
import { APP_CONFIG } from '../lib/config';
import { formatPrice } from '../lib/utils';

const WidgetVendors = ({ vendors, onVendorClick }) => {
  return (
    <div className="scroll-list">
      {vendors.map(vendor => (
        <div key={vendor.id} className="row" onClick={() => onVendorClick(vendor)}>
          <div>
            <div className="rowT">{vendor.name}</div>
            <div className="rowS">
              {vendor.category}
              {vendor.price > 0 && (
                <span style={{ color: 'var(--ink)', fontWeight: 'bold' }}>
                   {' — ' + formatPrice(vendor.price)}
                </span>
              )}
            </div>
          </div>
          
          {/* Le badge de statut (ex: "Devis reçu") */}
          <div className="tag">
            {APP_CONFIG.statuses.vendors[vendor.status] || vendor.status}
          </div>
        </div>
      ))}
      
      {vendors.length === 0 && <div style={{textAlign:'center', padding:20, color:'#999', fontSize:12}}>Aucun prestataire</div>}
    </div>
  );
};

export default WidgetVendors;