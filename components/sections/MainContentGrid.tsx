"use client";
    
import React from "react";
import dynamic from "next/dynamic";
import { SimpleGrid, Stack, Group, Title, Text } from "@mantine/core";

const NewsletterSignup = dynamic(
  () => import("@/app/(pages)/signup/signup"),
);
const AuthorPost = dynamic(() => import("@/components/author/post"));

export function MainContentGrid() {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
      <Stack gap="lg">
        <Group gap="sm" align="baseline">
          <Title order={2} size="3xl" fw={700} c="dark">
            Subscribe
          </Title>
          <Text size="sm" c="dimmed">
            Join the newsletter
          </Text>
        </Group>
        <NewsletterSignup />
      </Stack>

      <Stack gap="lg">
        <Group gap="sm" align="baseline">
          <Title order={2} size="3xl" fw={700} c="dark">
            Create
          </Title>
          <Text size="sm" c="dimmed">
            Write and publish
          </Text>
        </Group>
        <AuthorPost />
      </Stack>
    </SimpleGrid>
  );
}
