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
    <Container size="lg" py={40}>
      <Stack gap={80}>
        {/* Header */}
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title 
              size="3rem" 
              fw={700} 
              c="black"
            >
              letterd
            </Title>
            <Text size="xl" c="dimmed" fw={300}>
              Personal newsletter platform
            </Text>
          </Stack>
          <ThemeToggle />
        </Group>

        {/* Main Content Grid */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
          {/* Subscribe Section */}
          <Stack gap="lg">
            <Group gap="sm" align="baseline">
              <Title order={2} size="2xl" fw={600} c="black">
                Subscribe
              </Title>
              <Text size="sm" c="dimmed">
                Join the newsletter
              </Text>
            </Group>
            <NewsletterSignup />
          </Stack>

          {/* Create Section */}
          <Stack gap="lg">
            <Group gap="sm" align="baseline">
              <Title order={2} size="2xl" fw={600} c="black">
                Create
              </Title>
              <Text size="sm" c="dimmed">
                Write and publish
              </Text>
            </Group>
            <AuthorPost />
          </Stack>
        </SimpleGrid>

        {/* Posts Section */}
        <Stack gap="xl">
          <Group justify="center" gap="sm">
            <Title order={2} size="2xl" fw={600} c="black">
              Published Posts
            </Title>
          </Group>
          <ViewPosts />
        </Stack>

        {/* Scheduled Posts Section */}
        <Stack gap="xl">
          <Group justify="center" gap="sm">
            <Title order={2} size="2xl" fw={600} c="black">
              Scheduled Posts
            </Title>
          </Group>
          <ViewScheduledPosts />
        </Stack>
      </Stack>
    </Container>
  );
}
