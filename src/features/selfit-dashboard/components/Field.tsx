import { fieldClass } from '../constants';

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

export function Field({ label, value, onChange, type = 'text', required = false, placeholder = '' }: FieldProps) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={fieldClass}
      />
    </label>
  );
}
