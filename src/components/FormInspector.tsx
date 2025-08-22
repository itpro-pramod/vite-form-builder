import React from 'react';
import { FormField } from './FormBuilder';

interface FormInspectorProps {
  selectedField: FormField | null;
  onFieldUpdate: (field: FormField) => void;
}

export const FormInspector: React.FC<FormInspectorProps> = ({
  selectedField,
  onFieldUpdate,
}) => {
  if (!selectedField) {
    return (
      <div className="border-t border-border">
        <div className="panel-header">
          Field Properties
        </div>
        <div className="panel-content">
          <p className="text-muted-foreground text-sm text-center py-8">
            Select a field to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    onFieldUpdate({ ...selectedField, [field]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(selectedField.options || [])];
    newOptions[index] = value;
    handleInputChange('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(selectedField.options || []), 'New Option'];
    handleInputChange('options', newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = (selectedField.options || []).filter((_, i) => i !== index);
    handleInputChange('options', newOptions);
  };

  const needsOptions = ['select', 'radio', 'checkbox'].includes(selectedField.type);

  return (
    <div className="border-t border-border">
      <div className="panel-header">
        Field Properties
      </div>
      <div className="panel-content space-y-4">
        {/* Basic Properties */}
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={selectedField.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
            className="w-full p-2 border border-input rounded bg-background"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedField.required}
            onChange={(e) => handleInputChange('required', e.target.checked)}
            id="required-checkbox"
          />
          <label htmlFor="required-checkbox" className="text-sm font-medium">
            Required field
          </label>
        </div>

        {/* Type-specific properties */}
        {selectedField.type === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-1">Placeholder</label>
            <input
              type="text"
              value={selectedField.placeholder || ''}
              onChange={(e) => handleInputChange('placeholder', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background"
            />
          </div>
        )}

        {selectedField.type === 'textarea' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Placeholder</label>
              <input
                type="text"
                value={selectedField.placeholder || ''}
                onChange={(e) => handleInputChange('placeholder', e.target.value)}
                className="w-full p-2 border border-input rounded bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rows</label>
              <input
                type="number"
                min="1"
                max="10"
                value={selectedField.rows || 3}
                onChange={(e) => handleInputChange('rows', parseInt(e.target.value))}
                className="w-full p-2 border border-input rounded bg-background"
              />
            </div>
          </>
        )}

        {selectedField.type === 'file' && (
          <div>
            <label className="block text-sm font-medium mb-1">Accepted file types</label>
            <input
              type="text"
              value={selectedField.accept || ''}
              onChange={(e) => handleInputChange('accept', e.target.value)}
              placeholder=".pdf,.doc,.jpg"
              className="w-full p-2 border border-input rounded bg-background"
            />
          </div>
        )}

        {selectedField.type === 'rating' && (
          <div>
            <label className="block text-sm font-medium mb-1">Maximum stars</label>
            <input
              type="number"
              min="1"
              max="10"
              value={selectedField.max || 5}
              onChange={(e) => handleInputChange('max', parseInt(e.target.value))}
              className="w-full p-2 border border-input rounded bg-background"
            />
          </div>
        )}

        {/* Options for select, radio, checkbox */}
        {needsOptions && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Options</label>
              <button
                onClick={addOption}
                className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded"
              >
                Add Option
              </button>
            </div>
            <div className="space-y-2">
              {(selectedField.options || []).map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 p-2 border border-input rounded bg-background"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};