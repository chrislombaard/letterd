import React from "react";
import { Card, Text } from "@mantine/core";

export function EmptyScheduledPostsCard() {
  return (
    <Card
      withBorder
      p="xl"
      radius="md"
      style={{ borderStyle: "dashed" }}
      bg="gray.0"
    >
      <Text size="lg" c="dimmed" ta="center">
        No scheduled posts yet
      </Text>
      <Text size="sm" c="dimmed" ta="center" mt="xs">
        Schedule a post above to see it appear here
      </Text>
    </Card>
  );
}
