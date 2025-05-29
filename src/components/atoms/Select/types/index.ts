export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
  options: SelectOption[];
}
