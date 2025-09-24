"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Stack,
  Group,
} from "@mantine/core";
import { ThemeToggle } from "../components/theme-toggle";

const NewsletterSignup = dynamic(() => import("./newsletter-signup"));
const AuthorPost = dynamic(() => import("./author-post"));
const ViewPosts = dynamic(() => import("./view-posts"));
const ViewScheduledPosts = dynamic(() => import("./view-scheduled-posts"));

export default function NewsletterHome() {
  return (
    <Container size="md" py={60}>
      <Stack gap={60}>
        <Group justify="space-between" align="flex-start">
          <Stack gap="sm">
            <Title size="2.5rem" fw={400}>
              letterd
            </Title>
            <Text size="lg" c="dimmed" maw={500}>
              Personal newsletter platform
            </Text>
          </Stack>
          <ThemeToggle />
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
          <Stack gap="md">
            <Title order={2} size="xl" fw={500}>
              Subscribe
            </Title>
            <NewsletterSignup />
          </Stack>

          <Stack gap="md">
            <Title order={2} size="xl" fw={500}>
              Create
            </Title>
            <AuthorPost />
          </Stack>
        </SimpleGrid>

        <Stack gap="lg">
          <Title order={2} size="xl" fw={500} ta="center">
            Posts
          </Title>
          <ViewPosts />
        </Stack>

        <Stack gap="lg">
          <Title order={2} size="xl" fw={500} ta="center">
            Scheduled Posts
          </Title>
          <ViewScheduledPosts />
        </Stack>
      </Stack>
    </Container>
  );
}
