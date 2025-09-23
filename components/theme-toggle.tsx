"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      size="lg"
      variant="subtle"
      color={isDark ? "yellow" : "blue"}
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