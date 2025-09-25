import React from "react";
import { Card, Stack, Group, Title, Text, Badge } from "@mantine/core";
import { IconClock, IconCalendar } from "@tabler/icons-react";

interface ScheduledPost {
  id: string;
  title: string;
  subject: string;
  scheduledAt: string;
  createdAt: string;
}

interface ScheduledPostCardProps {
  post: ScheduledPost;
}

function formatScheduledTime(scheduledAt: string) {
  const date = new Date(scheduledAt);
  const now = new Date();
  const diffHours = Math.round(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60),
  );

  if (diffHours < 1) return "Less than 1 hour";

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScheduledPostCard({ post }: ScheduledPostCardProps) {
  return (
    <Card
      withBorder
      p="xl"
      radius="md"
      bg="gray.0"
      style={{
        borderColor: "var(--mantine-color-gray-2)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm" align="center">
            <IconClock size={20} color="var(--mantine-color-gray-6)" />
            <Title order={4} size="xl" fw={700}>
              {post.title}
            </Title>
          </Group>
          <Badge variant="filled" color="dark" size="lg">
            Scheduled
          </Badge>
        </Group>

        <Group gap="xs" align="center" ml={32}>
          <Text size="md" c="dimmed">
            Subject: {post.subject}
          </Text>
        </Group>

        <Group gap="lg" align="center" ml={32}>
          <Group gap="xs" align="center">
            <IconCalendar size={16} color="var(--mantine-color-gray-6)" />
            <Text size="sm" fw={500}>
              {formatDateTime(post.scheduledAt)}
            </Text>
          </Group>
          <Badge variant="light" color="gray" size="md">
            in {formatScheduledTime(post.scheduledAt)}
          </Badge>
        </Group>
      </Stack>
    </Card>
  );
}
