import useSWR from "swr";
import { Card, Title, Text, Stack, Loader, Paper, Group } from "@mantine/core";

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

export default function ViewPosts() {
  const { data: posts, error } = useSWR<Post[]>("/api/posts", fetcher);

  if (error)
    return (
      <Paper p="md" my="md" withBorder color="red">
        Error loading posts.
      </Paper>
    );
  if (!posts) return <Loader my="xl" />;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <Title order={2} mb="md">
        Published Posts
      </Title>
      {posts.length === 0 && <Text>No posts yet.</Text>}
      <Stack>
        {posts.map((post) => (
          <Card key={post.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3}>{post.title}</Title>
            <Group gap="md" mb="xs">
              <Text size="sm" c="dimmed">
                <strong>Subject:</strong> {post.subject}
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Created:</strong>{" "}
                {new Date(post.createdAt).toLocaleString()}
              </Text>
            </Group>
            <Text dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          </Card>
        ))}
      </Stack>
    </div>
  );
}
