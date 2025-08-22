import React from 'react';

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'textarea', label: 'Text Area', icon: '📄' },
  { type: 'select', label: 'Dropdown', icon: '📋' },
  { type: 'radio', label: 'Radio Group', icon: '🔘' },
  { type: 'checkbox', label: 'Checkboxes', icon: '☑️' },
  { type: 'file', label: 'File Upload', icon: '📎' },
  { type: 'rating', label: 'Rating (Stars)', icon: '⭐' },
];

export const FormPalette: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, fieldType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ fieldType }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="palette-panel">
      <div className="panel-header">
        Form Controls
      </div>
      <div className="panel-content">
        {fieldTypes.map(({ type, label, icon }) => (
          <div
            key={type}
            className="drag-item"
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};