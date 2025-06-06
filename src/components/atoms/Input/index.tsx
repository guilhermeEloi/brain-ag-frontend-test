import { TextField } from "@mui/material";
import type { InputProps } from "./types";

const Input = ({
  label,
  name,
  value,
  onChange,
  variant,
  required,
  disabled,
  length,
  error,
  helperText,
  type,
}: InputProps) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      required={required}
      variant={variant}
      margin="normal"
      disabled={disabled}
      error={error}
      helperText={helperText}
      type={type ? type : "text"}
      inputProps={{
        form: {
          autoComplete: "off",
        },
        maxLength: length || "none",
      }}
    />
  );
};

export default Input;
