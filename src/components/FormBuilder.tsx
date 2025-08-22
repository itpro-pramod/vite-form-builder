import React, { useState, useCallback } from 'react';
import { FormPalette } from './FormPalette';
import { FormCanvas } from './FormCanvas';
import { FormInspector } from './FormInspector';
import { FormPreview } from './FormPreview';
import { generateId, createField } from '../utils/formUtils';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'rating';
  label: string;
  required: boolean;
  placeholder?: string;
  rows?: number;
  options?: string[];
  accept?: string;
  max?: number;
}

export const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const handleDrop = useCallback((fieldType: string, index?: number) => {
    const newField = createField(fieldType);
    const insertIndex = index !== undefined ? index : fields.length;
    
    const newFields = [...fields];
    newFields.splice(insertIndex, 0, newField);
    setFields(newFields);
    setSelectedField(newField);
  }, [fields]);

  const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    const newFields = [...fields];
    const draggedField = newFields[dragIndex];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    setFields(newFields);
  }, [fields]);

  const handleFieldUpdate = useCallback((updatedField: FormField) => {
    setFields(prev => prev.map(field => 
      field.id === updatedField.id ? updatedField : field
    ));
    setSelectedField(updatedField);
  }, []);

  const handleFieldDelete = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [selectedField]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(fields, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'form-schema.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [fields]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedFields = JSON.parse(e.target?.result as string);
        setFields(importedFields);
        setSelectedField(null);
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear all fields?')) {
      setFields([]);
      setSelectedField(null);
    }
  }, []);

  if (isPreview) {
    return (
      <FormPreview 
        fields={fields} 
        onBack={() => setIsPreview(false)} 
      />
    );
  }

  return (
    <div className="form-builder">
      <FormPalette />
      
      <FormCanvas
        fields={fields}
        selectedField={selectedField}
        onFieldSelect={setSelectedField}
        onFieldDrop={handleDrop}
        onFieldReorder={handleReorder}
        onFieldDelete={handleFieldDelete}
      />
      
      <div className="inspector-panel">
        <div className="panel-header flex items-center justify-between">
          <span>Actions</span>
        </div>
        <div className="panel-content space-y-3">
          <button 
            className="action-button w-full"
            onClick={() => setIsPreview(true)}
            disabled={fields.length === 0}
          >
            Preview Form
          </button>
          
          <button 
            className="secondary-button w-full"
            onClick={handleExport}
            disabled={fields.length === 0}
          >
            Export JSON
          </button>
          
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
              id="import-input"
            />
            <button 
              className="secondary-button w-full"
              onClick={() => document.getElementById('import-input')?.click()}
            >
              Import JSON
            </button>
          </div>
          
          <button 
            className="secondary-button w-full"
            onClick={handleClear}
            disabled={fields.length === 0}
          >
            Clear All
          </button>
        </div>
        
        <FormInspector
          selectedField={selectedField}
          onFieldUpdate={handleFieldUpdate}
        />
      </div>
    </div>
  );
};