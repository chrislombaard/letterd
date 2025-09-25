"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Stack, Group, Title } from "@mantine/core";

const ViewPosts = dynamic(() => import("@/app/(pages)/posts/posts"));
const ViewScheduledPosts = dynamic(
  () => import("@/app/(pages)/scheduled/scheduled-posts"),
);

export function PostsSections() {
  return (
    <>
      <Stack gap="xl">
        <Group justify="center" gap="sm">
          <Title order={2} size="3xl" fw={700} c="dark">
            Published Posts
          </Title>
        </Group>
        <ViewPosts />
      </Stack>

      <Stack gap="xl">
        <Group justify="center" gap="sm">
          <Title order={2} size="3xl" fw={700} c="dark">
            Scheduled Posts
          </Title>
        </Group>
        <ViewScheduledPosts />
      </Stack>
    </>
  );
}
