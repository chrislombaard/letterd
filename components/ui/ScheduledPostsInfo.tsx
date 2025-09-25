import React from "react";
import { Text } from "@mantine/core";

export function ScheduledPostsInfo() {
  return (
    <Text
      size="sm"
      c="dimmed"
      ta="center"
      mt="lg"
      style={{
        padding: "12px",
        background: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
      }}
    >
      Scheduled posts will be automatically sent at their designated times
    </Text>
  );
}
