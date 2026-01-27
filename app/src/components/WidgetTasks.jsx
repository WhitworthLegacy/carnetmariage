import React from 'react';
import { APP_CONFIG } from '../lib/config';

const WidgetTasks = ({ tasks, onTaskClick }) => {
  
  // Les 3 colonnes de notre Kanban
  const columns = [
    { id: 'todo', label: APP_CONFIG.statuses.tasks.todo },
    { id: 'doing', label: APP_CONFIG.statuses.tasks.doing },
    { id: 'done', label: APP_CONFIG.statuses.tasks.done }
  ];

  return (
    <div className="view-kanban kanbanBoard">
      {columns.map(col => (
        <div key={col.id} className="kbCol" data-status={col.id}>
          <div className="kbHead">{col.label}</div>
          
          <div className="kbContent">
            {/* On filtre les tâches pour ne garder que celles de la colonne actuelle */}
            {tasks
              .filter(t => t.status === col.id)
              .map(task => (
                <div 
                  key={task.taskId} 
                  className="kbCard"
                  onClick={() => onTaskClick(task)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ 
                    color: 'var(--pink-main)', 
                    fontSize: '10px', 
                    textTransform: 'uppercase', 
                    fontWeight: 800 
                  }}>
                    {task.category}
                  </div>
                  <div>{task.title}</div>
                </div>
              ))}
              
              {/* Message si vide */}
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div style={{ fontSize: 11, color: '#ccc', textAlign: 'center', marginTop: 10 }}>
                  Vide
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WidgetTasks;