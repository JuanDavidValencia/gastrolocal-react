import { useState } from "react";

// Reutiliza el comportamiento de abrir, cerrar y alternar.
// Cada llamada conserva su propio estado.
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue((anterior) => !anterior);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return { value, toggle, setTrue, setFalse };
}
