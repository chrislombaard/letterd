import React from "react";
import { Card, Stack, Group, Title, Text, Badge, Box } from "@mantine/core";
import { IconCalendar, IconMail } from "@tabler/icons-react";

interface Post {
  id: string;
  title: string;
  subject: string;
  bodyHtml: string;
  status: string;
  scheduledAt: string | null;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card
      withBorder
      p="xl"
      radius="md"
      shadow="sm"
      style={{
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Title order={3} size="2xl" fw={700}>
            {post.title}
          </Title>
          <Badge
            variant="light"
            color={post.status === "SENT" ? "gray" : "dark"}
            size="lg"
          >
            {post.status}
          </Badge>
        </Group>

        <Group gap="xs" align="center">
          <IconMail size={16} color="var(--mantine-color-gray-6)" />
          <Text size="md" c="dimmed" fw={500}>
            {post.subject}
          </Text>
        </Group>

        <Box
          style={{
            background: "var(--mantine-color-gray-0)",
            border: "1px solid var(--mantine-color-gray-2)",
            borderRadius: "8px",
            padding: "16px",
            lineHeight: 1.6,
          }}
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />

        <Group gap="lg" mt="md">
          <Group gap="xs" align="center">
            <IconCalendar size={14} color="var(--mantine-color-gray-5)" />
            <Text size="sm" c="dimmed">
              Published{" "}
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
