import React from "react";
import useSWR, { mutate } from "swr";
import { Text, Stack, Loader, Group, Card, Box } from "@mantine/core";
import { PostCard } from "@/components/ui/PostCard";
import { EmptyPostsCard } from "@/components/ui/EmptyPostsCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Post {
  id: string;
  title: string;
  subject: string;
  bodyHtml: string;
  status: string;
  scheduledAt: string | null;
  createdAt: string;
}

export const refreshPosts = () => mutate("/api/posts");

export default function ViewPosts() {
  const { data: posts, error } = useSWR<Post[]>("/api/posts", fetcher);

  if (error)
    return (
      <Card withBorder p="lg" radius="md" bg="gray.0">
        <Text c="red" ta="center">
          Failed to load posts
        </Text>
      </Card>
    );

  if (!posts)
    return (
      <Group justify="center" py="xl">
        <Loader size="lg" color="gray" />
      </Group>
    );

  return (
    <Box>
      {posts.length === 0 ? (
        <EmptyPostsCard />
      ) : (
        <Stack gap="lg">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
