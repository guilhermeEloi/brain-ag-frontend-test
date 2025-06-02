export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

export interface SelectProps<T = string | number> {
  label: string;
  name: string;
  value: T;
  onChange: (e: React.ChangeEvent<{ name?: string; value: T }>) => void;
  options: SelectOption<T>[];
}
