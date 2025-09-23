"use client";

import { useState } from "react";
import { TextInput, Button, Paper, Title, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    
    if (res.ok) {
      notifications.show({ color: "green", title: "Subscribed!", message: "You have been added to the newsletter." });
      setEmail("");
    } else {
      const data = await res.json();
      notifications.show({ color: "red", title: "Error", message: data.error || "Error subscribing" });
    }
  }

  return (
    <Paper shadow="md" p="lg" radius="md" withBorder style={{ maxWidth: 400, margin: "2rem auto" }}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={3}>Sign Up for the Newsletter</Title>
          <TextInput
            type="email"
            label="Email"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            Subscribe
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
