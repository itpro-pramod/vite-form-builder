import { FormField } from '../components/FormBuilder';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createField = (type: string): FormField => {
  const id = generateId();
  
  const baseField: FormField = {
    id,
    type: type as FormField['type'],
    label: getDefaultLabel(type),
    required: false,
  };

  // Add type-specific default properties
  switch (type) {
    case 'text':
      return {
        ...baseField,
        placeholder: 'Enter text...',
      };
    
    case 'textarea':
      return {
        ...baseField,
        placeholder: 'Enter your message...',
        rows: 3,
      };
    
    case 'select':
    case 'radio':
    case 'checkbox':
      return {
        ...baseField,
        options: ['Option 1', 'Option 2', 'Option 3'],
      };
    
    case 'file':
      return {
        ...baseField,
        accept: '',
      };
    
    case 'rating':
      return {
        ...baseField,
        max: 5,
      };
    
    default:
      return baseField;
  }
};

const getDefaultLabel = (type: string): string => {
  const labels: Record<string, string> = {
    text: 'Text Input',
    textarea: 'Text Area', 
    select: 'Dropdown',
    radio: 'Radio Group',
    checkbox: 'Checkboxes',
    file: 'File Upload',
    rating: 'Rating',
  };
  
  return labels[type] || 'Field';
};