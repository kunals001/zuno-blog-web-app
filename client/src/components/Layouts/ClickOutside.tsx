import { useEffect } from "react";

type UseClickOutsideParams = {
  ref: React.RefObject<HTMLElement | null>;
  onOutsideClick: (event: MouseEvent) => void;
  ignoreRefs?: React.RefObject<HTMLElement | null>[]; 
};

export const useClickOutside = ({
  ref,
  onOutsideClick,
  ignoreRefs = [],
}: UseClickOutsideParams) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      // if clicked inside main ref
      if (ref.current?.contains(target)) return;

      // if clicked inside any ignored ref
      for (const ignoreRef of ignoreRefs) {
        if (ignoreRef.current?.contains(target)) return;
      }

      onOutsideClick(event); 
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onOutsideClick, ignoreRefs]);
};
