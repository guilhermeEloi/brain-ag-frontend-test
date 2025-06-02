export interface InputProps {
  label: string;
  name: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  variant: "filled" | "outlined" | "standard";
  disabled?: boolean;
  length?: number;
  error?: boolean;
  helperText?: string | null;
  type?: string;
}
