"use client";

import React from "react";
import { Title, Text, Stack, Group } from "@mantine/core";
import { ThemeToggle } from "@/components/theme/toggle";

export function Header() {
  return (
    <Group justify="space-between" align="center">
      <Stack gap={4}>
        <Title size="3rem" fw={700} c="dark">
          letterd
        </Title>
        <Text size="xl" c="dimmed" fw={300}>
          Personal newsletter platform
        </Text>
      </Stack>
      <ThemeToggle />
    </Group>
  );
}
