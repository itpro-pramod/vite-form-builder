import React, { useState } from 'react';
import { FormField } from './FormBuilder';

interface FormPreviewProps {
  fields: FormField[];
  onBack: () => void;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ fields, onBack }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      console.log('Form submitted:', formData);
    }
  };

  const renderField = (field: FormField) => {
    const hasError = errors[field.id];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-3 border rounded-lg ${hasError ? 'border-destructive' : 'border-input'} focus:outline-none focus:ring-2 focus:ring-primary/20`}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={field.rows || 3}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-3 border rounded-lg resize-none ${hasError ? 'border-destructive' : 'border-input'} focus:outline-none focus:ring-2 focus:ring-primary/20`}
          />
        );

      case 'select':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-3 border rounded-lg ${hasError ? 'border-destructive' : 'border-input'} focus:outline-none focus:ring-2 focus:ring-primary/20`}
          >
            <option value="">Choose an option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData[field.id] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = formData[field.id] || [];
                    if (e.target.checked) {
                      handleInputChange(field.id, [...currentValues, option]);
                    } else {
                      handleInputChange(field.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            accept={field.accept}
            onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
            className={`w-full p-3 border rounded-lg ${hasError ? 'border-destructive' : 'border-input'} focus:outline-none focus:ring-2 focus:ring-primary/20`}
          />
        );

      case 'rating':
        const maxStars = field.max || 5;
        const currentRating = formData[field.id] || 0;
        return (
          <div className="flex space-x-1">
            {Array.from({ length: maxStars }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleInputChange(field.id, i + 1)}
                className={`text-2xl transition-colors ${
                  i < currentRating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="form-builder">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4">Form Submitted!</h2>
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Submitted Data:</h3>
              <pre className="text-sm text-left overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
            <div className="space-x-3">
              <button
                onClick={() => setSubmitted(false)}
                className="secondary-button"
              >
                Submit Another
              </button>
              <button
                onClick={onBack}
                className="action-button"
              >
                Back to Builder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-builder">
      <div className="flex-1 flex flex-col">
        <div className="panel-header flex items-center justify-between">
          <span>Form Preview</span>
          <button onClick={onBack} className="secondary-button">
            Back to Builder
          </button>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="block font-medium">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.id] && (
                    <p className="text-destructive text-sm">{errors[field.id]}</p>
                  )}
                </div>
              ))}
              
              {fields.length > 0 && (
                <button type="submit" className="action-button">
                  Submit Form
                </button>
              )}
            </form>
            
            {fields.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">📝</p>
                <p>No fields to preview. Add some fields to your form first!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};