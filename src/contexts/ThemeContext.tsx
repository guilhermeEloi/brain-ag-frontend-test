import { createContext } from "react";

interface ThemeContextType {
  toggleColorMode: () => void;
  mode: "light" | "dark";
}

export const ColorModeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: "light",
});
