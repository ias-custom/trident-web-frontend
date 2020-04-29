import { useRef, useState, useEffect } from "react";

const useStateAndRef = (initialState) => {
  const [value, setValue] = useState(initialState);
  const valueRef = useRef(initialState);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return [value, setValue, valueRef];
};

export { useStateAndRef };
