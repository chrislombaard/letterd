"use client";

import React, { useState } from "react";
import { TextInput, Textarea, Button, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { refreshPosts } from "@/app/(pages)/posts/posts";
import { refreshScheduledPosts } from "@/app/(pages)/scheduled/scheduled-posts";

export default function AuthorPost() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      subject,
      bodyHtml,
      ...(scheduledAt ? { scheduledAt } : { publishNow: true }),
    };

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);

    if (res.ok) {
      const result = await res.json();
      const subscriberCount = result.subscribersCount || 0;
      const subscriberText =
        subscriberCount === 1 ? "subscriber" : "subscribers";
      const message = result.publishedImmediately
        ? `Published immediately to ${subscriberCount} ${subscriberText}!`
        : scheduledAt
          ? "Post scheduled successfully"
          : "Post saved as draft";

      notifications.show({
        color: "gray",
        title: "Success",
        message,
      });

      if (result.publishedImmediately) {
        refreshPosts();
      } else if (scheduledAt) {
        refreshScheduledPosts();
      }

      setTitle("");
      setSubject("");
      setBodyHtml("");
      setScheduledAt("");
    } else {
      notifications.show({
        color: "gray",
        title: "Error",
        message: "Failed to create post",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Text size="md" c="dimmed">
            Write and publish your newsletter
          </Text>
          <Text size="sm" c="dimmed">
            Scheduled posts will be sent automatically at the specified time
          </Text>
        </Stack>

        <Stack gap="md">
          <TextInput
            id="post-title"
            label="Title"
            placeholder="Newsletter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            size="md"
            radius="md"
            styles={{
              input: {
                border: "2px solid #e9ecef",
                "&:focus": {
                  borderColor: "var(--focus-color)",
                },
              },
            }}
          />

          <TextInput
            id="post-subject"
            label="Email Subject"
            placeholder="What readers see in their inbox"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            size="md"
            radius="md"
            styles={{
              input: {
                border: "2px solid #e9ecef",
                "&:focus": {
                  borderColor: "var(--focus-color)",
                },
              },
            }}
          />

          <Textarea
            id="post-body"
            label="Content"
            placeholder="Write your newsletter content here... You can use HTML tags like <h1>, <p>, <strong>, etc."
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            required
            minRows={4}
            maxRows={8}
            autosize
            size="md"
            radius="md"
            styles={{
              input: {
                border: "2px solid #e9ecef",
                "&:focus": {
                  borderColor: "var(--focus-color)",
                },
              },
            }}
          />

          <TextInput
            id="post-schedule"
            type="datetime-local"
            label="Schedule for Later (Optional)"
            placeholder="Leave empty to publish immediately"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            size="md"
            radius="md"
            styles={{
              input: {
                border: "2px solid #e9ecef",
                "&:focus": {
                  borderColor: "var(--focus-color)",
                },
              },
            }}
          />
        </Stack>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
          radius="md"
          color="dark"
          variant="filled"
        >
          {loading
            ? "Publishing..."
            : scheduledAt
              ? "Schedule Post"
              : "Publish Now"}
        </Button>
      </Stack>
    </form>
  );
}
