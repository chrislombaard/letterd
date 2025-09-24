"use client";

import React from "react";
import { Stack, Card, Text, Group, Badge } from "@mantine/core";
import { IconClock, IconCalendar } from "@tabler/icons-react";
import useSWR from "swr";

interface ScheduledPost {
  id: string;
  title: string;
  subject: string;
  scheduledAt: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

let globalRefreshScheduledPosts: (() => void) | null = null;

export function refreshScheduledPosts() {
  if (globalRefreshScheduledPosts) {
    globalRefreshScheduledPosts();
  }
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

export default function ViewScheduledPosts() {
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR<ScheduledPost[] | { error: string }>(
    "/api/posts/scheduled",
    fetcher,
    {
      refreshInterval: 30000,
    },
  );

  globalRefreshScheduledPosts = mutate;

  if (isLoading) return <Text c="dimmed">Loading scheduled posts...</Text>;

  if (error) return <Text c="red">Failed to load scheduled posts</Text>;

  if (response && "error" in response) {
    return <Text c="red">Error: {response.error}</Text>;
  }

  const posts = response as ScheduledPost[] | undefined;

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return (
      <Card withBorder p="md" bg="gray.0" style={{ borderStyle: "dashed" }}>
        <Text c="dimmed" ta="center">
          No posts scheduled yet. Create a post with a future date to see it
          here.
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="sm">
      {posts.map((post) => (
        <Card key={post.id} withBorder p="md" bg="blue.0">
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs" style={{ flex: 1 }}>
              <Group gap="xs">
                <IconClock size={16} color="var(--mantine-color-blue-6)" />
                <Text size="sm" fw={600}>
                  {post.title}
                </Text>
                <Badge variant="light" color="blue" size="sm">
                  Scheduled
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                Subject: {post.subject}
              </Text>

              <Group gap="md" align="center">
                <Group gap="xs" align="center">
                  <IconCalendar size={14} />
                  <Text size="xs" c="dimmed">
                    {formatDateTime(post.scheduledAt)}
                  </Text>
                </Group>
                <Text size="xs" c="blue.7" fw={500}>
                  in {formatScheduledTime(post.scheduledAt)}
                </Text>
              </Group>
            </Stack>
          </Group>
        </Card>
      ))}

      <Text size="xs" c="dimmed" ta="center" mt="xs">
        Scheduled posts will be automatically sent at their designated times
      </Text>
    </Stack>
  );
}
