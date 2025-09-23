"use client";

import { useState } from "react";
import { 
  TextInput, 
  Textarea, 
  Button, 
  Stack,
  Text
} from "@mantine/core";
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
      notifications.show({ 
        color: "green", 
        title: "Post created", 
        message: "Your newsletter post is ready"
      });
      setTitle("");
      setSubject("");
      setBodyHtml("");
      setScheduledAt("");
    } else {
      notifications.show({ 
        color: "red", 
        title: "Error", 
        message: "Failed to create post" 
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Create and schedule your newsletter post
        </Text>
        
        <TextInput
          id="post-title"
          label="Title"
          placeholder="Post title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        
        <TextInput
          id="post-subject"
          label="Email subject"
          placeholder="Subject line for email"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
        
        <Textarea
          id="post-body"
          label="Content"
          placeholder="Write your newsletter content..."
          value={bodyHtml}
          onChange={e => setBodyHtml(e.target.value)}
          required
          minRows={6}
          maxRows={12}
          autosize
        />
        
        <TextInput
          id="post-schedule"
          type="datetime-local"
          label="Schedule (optional)"
          value={scheduledAt}
          onChange={e => setScheduledAt(e.target.value)}
        />

        <Button 
          type="submit" 
          loading={loading}
          fullWidth
          color="dark"
          variant="filled"
        >
          {loading ? "Creating..." : scheduledAt ? "Schedule" : "Publish"}
        </Button>
      </Stack>
    </form>
  );
}
