import React, { useState } from 'react';
import { FormField } from './FormBuilder';

interface FormCanvasProps {
  fields: FormField[];
  selectedField: FormField | null;
  onFieldSelect: (field: FormField | null) => void;
  onFieldDrop: (fieldType: string, index?: number) => void;
  onFieldReorder: (dragIndex: number, hoverIndex: number) => void;
  onFieldDelete: (fieldId: string) => void;
}

export const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  selectedField,
  onFieldSelect,
  onFieldDrop,
  onFieldReorder,
  onFieldDelete,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.fieldType) {
        onFieldDrop(data.fieldType, index);
      } else if (data.fieldIndex !== undefined) {
        // Reordering existing field
        if (index !== undefined && data.fieldIndex !== index) {
          onFieldReorder(data.fieldIndex, index);
        }
      }
    } catch (error) {
      console.error('Invalid drag data');
    }
  };

  const handleFieldDragStart = (e: React.DragEvent, fieldIndex: number) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ fieldIndex }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const renderField = (field: FormField) => {
    const isSelected = selectedField?.id === field.id;
    
    return (
      <div
        key={field.id}
        className={`form-field ${isSelected ? 'selected' : ''}`}
        onClick={() => onFieldSelect(field)}
        draggable
        onDragStart={(e) => handleFieldDragStart(e, fields.indexOf(field))}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-sm">{field.label}</span>
              {field.required && <span className="text-destructive text-sm">*</span>}
            </div>
            {renderFieldPreview(field)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFieldDelete(field.id);
            }}
            className="text-destructive hover:bg-destructive/10 p-1 rounded"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className="w-full p-2 border border-input rounded bg-background"
            disabled
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className="w-full p-2 border border-input rounded bg-background resize-none"
            disabled
          />
        );
      case 'select':
        return (
          <select className="w-full p-2 border border-input rounded bg-background" disabled>
            <option>Choose an option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.id} disabled />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'file':
        return (
          <input
            type="file"
            accept={field.accept}
            className="w-full p-2 border border-input rounded bg-background"
            disabled
          />
        );
      case 'rating':
        return (
          <div className="flex space-x-1">
            {Array.from({ length: field.max || 5 }, (_, i) => (
              <span key={i} className="text-xl text-muted-foreground">☆</span>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="canvas-panel">
      <div className="panel-header">
        Form Canvas
      </div>
      <div className="panel-content">
        {fields.length === 0 ? (
          <div
            className="drop-zone flex items-center justify-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">🎯</p>
              <p>Drag form controls here to start building</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id}>
                {/* Drop zone above each field */}
                <div
                  className={`h-2 border-dashed border-2 border-transparent transition-colors ${
                    dragOverIndex === index ? 'border-primary bg-primary/10' : ''
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(index);
                  }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(e) => handleDrop(e, index)}
                />
                {renderField(field)}
                {/* Drop zone after last field */}
                {index === fields.length - 1 && (
                  <div
                    className={`h-2 border-dashed border-2 border-transparent transition-colors ${
                      dragOverIndex === fields.length ? 'border-primary bg-primary/10' : ''
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(fields.length);
                    }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={(e) => handleDrop(e, fields.length)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};