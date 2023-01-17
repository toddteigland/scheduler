import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);

    setHistory((prev) => {
      if (replace) {
        prev.pop();
      }
      prev.push(newMode);
      return prev;
    });
  };

  const back = () => {
    if (history.length > 1) {
      setHistory((prev) => {
        prev.pop();
        setMode(prev[prev.length - 1]);
        return prev;
      });
    }
  };
  return { mode, transition, back };
}
