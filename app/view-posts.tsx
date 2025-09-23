import useSWR from "swr";
import { 
  Title, 
  Text, 
  Stack, 
  Loader, 
  Group, 
  Divider,
  Box
} from "@mantine/core";

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
      <Box p="md" style={{ borderLeft: "3px solid var(--mantine-color-red-5)" }}>
        <Text c="red">Failed to load posts</Text>
      </Box>
    );
    
  if (!posts) 
    return <Loader size="sm" />;

  return (
    <Box>
      {posts.length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" py="xl">
          No posts yet
        </Text>
      ) : (
        <Stack gap="xl">
          {posts.map((post) => (
            <Box key={post.id}>
              <Stack gap="sm">
                <Title order={3} size="lg" fw={500}>
                  {post.title}
                </Title>
                
                <Text size="sm" c="dimmed">
                  {post.subject}
                </Text>
                
                <Text 
                  size="sm"
                  style={{ lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: post.bodyHtml }} 
                />
                
                <Group gap="md" mt="xs">
                  <Text size="xs" c="dimmed">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {post.status}
                  </Text>
                </Group>
              </Stack>
              
              <Divider my="xl" />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
