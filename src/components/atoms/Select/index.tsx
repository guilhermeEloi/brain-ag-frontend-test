import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { SelectProps } from "./types";

const Select = <T extends string | number>({
  label,
  name,
  value,
  onChange,
  options,
}: SelectProps<T>) => {
  const handleChange = (event: SelectChangeEvent<T>) => {
    onChange({
      target: {
        name: event.target.name!,
        value: event.target.value,
      },
    } as React.ChangeEvent<{ name?: string; value: T }>);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <MuiSelect<T>
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
