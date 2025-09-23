"use client";

import { useState } from "react";
import { TextInput, Textarea, Button, Paper, Title, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function AuthorPost() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subject, bodyHtml, scheduledAt }),
    });
    setLoading(false);

    if (res.ok) {
      notifications.show({ color: "green", title: "Post created!", message: "Your post has been created." });
      setTitle("");
      setSubject("");
      setBodyHtml("");
      setScheduledAt("");
    } else {
      notifications.show({ color: "red", title: "Error", message: "Error creating post" });
    }
  }

  return (
    <Paper shadow="md" p="lg" radius="md" withBorder style={{ maxWidth: 600, margin: "2rem auto" }}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={3}>Author New Post</Title>
          <TextInput
            label="Title"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <TextInput
            label="Subject"
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
          <Textarea
            label="Body (HTML allowed)"
            placeholder="Body (HTML allowed)"
            value={bodyHtml}
            onChange={e => setBodyHtml(e.target.value)}
            required
            minRows={8}
          />
          <TextInput
            type="datetime-local"
            label="Schedule (optional)"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
          />
          <Button type="submit" loading={loading} fullWidth>
            Create Post
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
