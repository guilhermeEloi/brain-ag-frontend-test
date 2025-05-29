import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { SelectProps } from "./types";

const Select = ({ label, name, value, onChange, options }: SelectProps) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange({
      target: {
        name: event.target.name!,
        value: event.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
