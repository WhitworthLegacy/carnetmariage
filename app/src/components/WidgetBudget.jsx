import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatPrice } from '../lib/utils'; // Notre fonction qui ajoute le symbole €

// On doit "enregistrer" les outils de graphique (obligatoire avec cette librairie)
ChartJS.register(ArcElement, Tooltip, Legend);

const WidgetBudget = ({ budgetLines, onLineClick }) => {
  
  // 1. Calculs des totaux
  const totalEstimated = budgetLines.reduce((acc, curr) => acc + (Number(curr.estimated) || 0), 0);
  const totalPaid = budgetLines.reduce((acc, curr) => acc + (Number(curr.paid) || 0), 0);
  const remaining = totalEstimated - totalPaid;

  // 2. Préparation des données pour le graphique
  // On trie pour avoir les plus grosses dépenses en premier
  const sortedLines = [...budgetLines].sort((a, b) => b.estimated - a.estimated);
  
  // On prend les 5 plus gros postes, et on groupe le reste dans "Autres"
  const topItems = sortedLines.slice(0, 5);
  const otherItemsTotal = sortedLines.slice(5).reduce((acc, curr) => acc + curr.estimated, 0);
  
  const chartData = {
    labels: [...topItems.map(i => i.label), 'Autres'],
    datasets: [
      {
        data: [...topItems.map(i => i.estimated), otherItemsTotal],
        backgroundColor: [
          '#D8A7B1', // Pink main
          '#EAD4D8', // Pink light variant
          '#C7BEB8', // Greige
          '#9ca3af', // Muted blue/grey
          '#FCE7F3', // Very light pink
          '#f3f4f6', // Grey for others
        ],
        borderWidth: 0, // Pas de bordure moche
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // L'épaisseur du trou au milieu (75% = fin)
    plugins: {
      legend: { display: false }, // On cache la légende par défaut pour faire propre
      tooltip: { 
        callbacks: {
            label: (context) => formatPrice(context.raw)
        }
      }
    },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* SECTION GRAPHIQUE */}
      <div style={{ height: '180px', position: 'relative', marginBottom: 20 }}>
        <Doughnut data={chartData} options={chartOptions} />
        
        {/* Le texte au milieu du trou */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
            {remaining > 1000 ? (remaining / 1000).toFixed(1) + 'k€' : remaining + '€'}
          </div>
          <div style={{ fontSize: '10px', color: '#999' }}>Reste</div>
        </div>
      </div>

      {/* SECTION RÉSUMÉ */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 15, fontSize: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <b style={{ display:'block', fontSize:14 }}>{formatPrice(totalEstimated)}</b>
          <span style={{ color: '#999' }}>Estimé</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <b style={{ display:'block', fontSize:14, color: 'var(--pink-dark)' }}>{formatPrice(totalPaid)}</b>
          <span style={{ color: '#999' }}>Payé</span>
        </div>
      </div>

      {/* LISTE DÉFILANTE */}
      <div className="scroll-list">
        {sortedLines.map(line => (
          <div key={line.lineId} className="row" onClick={() => onLineClick(line)}>
            <div className="rowT">{line.label}</div>
            <div className="rowS">
              {formatPrice(line.estimated)}
              {line.paid > 0 && <span style={{color:'var(--pink-dark)', marginLeft:5}}>(-{line.paid})</span>}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WidgetBudget;