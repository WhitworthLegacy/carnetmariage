import React from 'react';
import { daysLeft, prettyDate } from '../lib/utils';
import { APP_CONFIG } from '../lib/config';

// Ce composant reçoit 'user' et 'progress' comme des infos (props)
const Hero = ({ user, progress }) => {
  const remaining = daysLeft(user.weddingDate);
  const datePretty = prettyDate(user.weddingDate);

  return (
    <div className="hero">
      <div className="hero-left">
        <div className="kicker">{APP_CONFIG.text.heroTitle}</div>
        <div className="hero-days">J-{remaining} avant le grand jour ✨</div>
      </div>
      
      <div className="hero-center">
        <h1>{user.prenom1} & {user.prenom2 || 'Moitié'}</h1>
        <div className="hero-date">{datePretty}</div>
      </div>
      
      <div className="hero-right">
        <div className="progress-section">
          <div className="progress-info">
            <span>{APP_CONFIG.text.progression}</span> 
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }} 
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;