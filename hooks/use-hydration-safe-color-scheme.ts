"use client";

import { useState, useEffect } from "react";
import { useMantineColorScheme } from "@mantine/core";

export function useHydrationSafeColorScheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    colorScheme: isHydrated ? colorScheme : "light",
    toggleColorScheme,
    isHydrated,
  };
}
