import React from "react";
import { Card, Text } from "@mantine/core";

export function EmptyPostsCard() {
  return (
    <Card
      withBorder
      p="xl"
      radius="md"
      style={{ borderStyle: "dashed" }}
      bg="gray.0"
    >
      <Text size="lg" c="dimmed" ta="center">
        No published posts yet
      </Text>
      <Text size="sm" c="dimmed" ta="center" mt="xs">
        Create and publish your first newsletter above
      </Text>
    </Card>
  );
}
