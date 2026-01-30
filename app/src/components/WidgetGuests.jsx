import React from "react";
import { APP_CONFIG } from "../lib/config";

const WidgetGuests = ({ guests, onGuestClick }) => {
  return (
    <div className="scroll-list">
      {guests.map((guest) => (
        <div key={guest.guestId} className="row" onClick={() => onGuestClick(guest)}>
          <div>
            <div className="rowT">{guest.name}</div>
            <div className="rowS">
              {guest.adults} Ad. {guest.kids > 0 ? `et ${guest.kids} Enf.` : ""}
            </div>
          </div>

          <div className="tag">{APP_CONFIG.statuses.guests[guest.status] || guest.status}</div>
        </div>
      ))}

      {guests.length === 0 && (
        <div style={{ textAlign: "center", padding: 20, color: "#999", fontSize: 12 }}>
          Liste vide
        </div>
      )}
    </div>
  );
};

export default WidgetGuests;
