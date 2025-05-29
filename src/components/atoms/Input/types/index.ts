export interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  variant: "filled" | "outlined" | "standard";
  disabled?: boolean;
  length?: number;
  error?: boolean;
  helperText?: string | null;
}
