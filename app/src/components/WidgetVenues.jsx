import React from "react";
import { APP_CONFIG } from "../lib/config";
import { formatPrice } from "../lib/utils";

const WidgetVenues = ({ venues, onVenueClick }) => {
  return (
    <div className="scroll-list">
      {venues.map((venue) => (
        <div key={venue.id} className="row" onClick={() => onVenueClick(venue)}>
          <div>
            <div className="rowT">{venue.name}</div>
            <div className="rowS">
              {venue.location}
              {venue.price > 0 && (
                <span style={{ color: "var(--ink)", fontWeight: "bold" }}>
                  {" — " + formatPrice(venue.price)}
                </span>
              )}
            </div>
          </div>

          <div className="tag">{APP_CONFIG.statuses.venues[venue.status] || venue.status}</div>
        </div>
      ))}

      {venues.length === 0 && (
        <div style={{ textAlign: "center", padding: 20, color: "#999", fontSize: 12 }}>
          Aucun lieu
        </div>
      )}
    </div>
  );
};

export default WidgetVenues;
