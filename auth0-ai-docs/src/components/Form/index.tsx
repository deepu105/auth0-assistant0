import React, { ReactNode, useEffect, useMemo } from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Spinner from '@site/src/components/Spinner';

interface FormField {
  name: string;
  label: string;
  type: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  sensitive?: boolean;
  defaultValue?: string;
  disabled?: boolean;
}

interface FormProps {
  onSave: (formData: { [key: string]: any }) => void;
  onCancel?: () => void;
  fields: FormField[];
  loading?: boolean;
  isDisabled?: boolean;
}

const defaultFields: FormField[] = [
  {
    name: 'clientID',
    label: 'Client ID',
    type: 'text',
    placeholder: 'Paste your Client ID here',
    required: true,
    description: 'The unique identifier for your application.',
  },
  {
    name: 'clientSecret',
    label: 'Client Secret',
    type: 'text',
    placeholder: 'Paste your Client Secret here',
    required: true,
    description:
      'The secret used by the application to authenticate with Auth0.',
    sensitive: true,
  },
];

export default function Form({
  onSave,
  onCancel,
  fields = defaultFields,
  loading,
  isDisabled,
}: FormProps): ReactNode {
  const defaultFormData = useMemo(
    () =>
      fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
      }, {}),
    [fields]
  );

  const defaultObscureFields = useMemo(
    () =>
      fields.reduce((acc, field) => {
        if (field.sensitive) {
          acc[field.name] = true;
        }
        return acc;
      }, {}),
    [fields]
  );
  const [formData, setFormData] = React.useState<{ [key: string]: any }>(
    defaultFormData
  );

  const [obscuredFields, setObscuredFields] = React.useState<{
    [key: string]: any;
  }>(defaultObscureFields);

  useEffect(() => {
    setFormData(defaultFormData);
    setObscuredFields(defaultObscureFields);
  }, [fields]);

  const toggleObscure = (fieldName: string) => {
    setObscuredFields((prevData) => ({
      ...prevData,
      [fieldName]: !prevData[fieldName],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };

      if (
        name === 'clientId' &&
        prevData['clientSecret'] === defaultFormData['clientSecret']
      ) {
        newData['clientSecret'] = '';
      }

      return newData;
    });
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    onCancel && onCancel();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const hasFormChanged = (): boolean => {
    for (const key in defaultFormData) {
      if (formData[key] !== defaultFormData[key]) {
        return true;
      }
    }
    return false;
  };

  const hasRequiredFields = (): boolean => {
    return fields.every((field) => {
      const value = formData[field.name];

      if (
        field.required &&
        (value === undefined || value === null || value === '')
      ) {
        return false;
      }

      return true;
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {fields.map((field) => (
        <div key={field.name} className={styles.formGroup}>
          <label htmlFor={field.name}>
            {field.label}
            {field.required && <span> *</span>}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={
              field.sensitive && obscuredFields[field.name]
                ? 'password'
                : field.type
            }
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            value={formData[field.name]}
            required={field.required}
            disabled={field.disabled || isDisabled}
            onChange={handleChange}
            className={styles.input}
          />
          {field.sensitive && (
            <img
              src={useBaseUrl(
                obscuredFields[field.name]
                  ? '/img/eye_open.svg'
                  : '/img/eye_closed.svg'
              )}
              alt="eye-closed-icon"
              className={styles.toggleEye}
              onClick={() => toggleObscure(field.name)}
            />
          )}
          {field.description && (
            <span className={styles.description}>{field.description}</span>
          )}
        </div>
      ))}
      <div className={styles.buttonGroup}>
        {loading ? (
          <span className={styles.formButton + ' ' + styles.loading}>
            <Spinner size="xs" />
          </span>
        ) : (
          <button
            type="submit"
            className={styles.formButton}
            disabled={isDisabled || !hasFormChanged() || !hasRequiredFields()}
          >
            Save
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            className={styles.formButton + ' ' + styles.cancel}
            onClick={handleCancel}
            disabled={isDisabled}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
