"use client";

import React from "react";
import { Stack, Card, Text, Group, Loader } from "@mantine/core";
import useSWR from "swr";
import { ScheduledPostCard } from "@/components/ui/ScheduledPostCard";
import { EmptyScheduledPostsCard } from "@/components/ui/EmptyScheduledPostsCard";
import { ScheduledPostsInfo } from "@/components/ui/ScheduledPostsInfo";

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
        <Text c="red" ta="center">
          Failed to load scheduled posts
        </Text>
      </Card>
    );

  if (response && "error" in response) {
    return (
      <Card withBorder p="lg" radius="md" bg="gray.0">
        <Text c="red" ta="center">
          Error: {response.error}
        </Text>
      </Card>
    );
  }

  const posts = response as ScheduledPost[] | undefined;

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return <EmptyScheduledPostsCard />;
  }

  return (
    <Stack gap="lg">
      {posts.map((post) => (
        <ScheduledPostCard key={post.id} post={post} />
      ))}
      <ScheduledPostsInfo />
    </Stack>
  );
}
