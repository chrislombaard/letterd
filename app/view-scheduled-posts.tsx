"use client";

import React from "react";
import { Stack, Card, Text, Group, Badge, Loader, Title } from "@mantine/core";
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

  if (isLoading) 
    return (
      <Group justify="center" py="xl">
        <Loader size="lg" color="gray" />
      </Group>
    );

  if (error) 
    return (
      <Card withBorder p="lg" radius="md" bg="gray.0">
        <Text c="red" ta="center">Failed to load scheduled posts</Text>
      </Card>
    );

  if (response && "error" in response) {
    return (
      <Card withBorder p="lg" radius="md" bg="gray.0">
        <Text c="red" ta="center">Error: {response.error}</Text>
      </Card>
    );
  }

  const posts = response as ScheduledPost[] | undefined;

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return (
      <Card withBorder p="xl" radius="md" style={{ borderStyle: "dashed" }} bg="gray.0">
        <Text size="lg" c="dimmed" ta="center">
          No scheduled posts yet
        </Text>
        <Text size="sm" c="dimmed" ta="center" mt="xs">
          Schedule a post above to see it appear here
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="lg">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          withBorder 
          p="xl" 
          radius="md" 
          bg="gray.0"
          style={{
            borderColor: 'var(--mantine-color-gray-2)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Group gap="sm" align="center">
                <IconClock size={20} color="var(--mantine-color-gray-6)" />
                <Title order={4} size="lg" fw={600}>
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
      ))}

      <Text size="sm" c="dimmed" ta="center" mt="lg" style={{
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
      }}>
        📅 Scheduled posts will be automatically sent at their designated times
      </Text>
    </Stack>
  );
}
