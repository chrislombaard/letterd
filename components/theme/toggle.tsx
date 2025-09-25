"use client";

import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useHydrationSafeColorScheme } from "../../hooks/use-hydration-safe-color-scheme";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme, isHydrated } =
    useHydrationSafeColorScheme();
  const isDark = colorScheme === "dark";

  if (!isHydrated) {
    // Return a static version during SSR to prevent hydration mismatch
    return (
      <ActionIcon
        size="lg"
        variant="subtle"
        color="gray"
        aria-label="Toggle color scheme"
        disabled
      >
        <IconMoon size={20} stroke={1.5} />
      </ActionIcon>
    );
  }

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      size="lg"
      variant="subtle"
      color={isDark ? "yellow" : "gray"}
      aria-label="Toggle color scheme"
    >
      {isDark ? (
        <IconSun size={20} stroke={1.5} />
      ) : (
        <IconMoon size={20} stroke={1.5} />
      )}
    </ActionIcon>
  );
}
