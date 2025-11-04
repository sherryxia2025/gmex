import { useEffect, useState } from "react";

export const useMount = (callback?: () => void) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    callback?.();
  }, [callback]);

  return mounted;
};
