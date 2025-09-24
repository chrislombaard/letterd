"use client";

import React, { useState } from "react";
import { 
  TextInput, 
  Button, 
  Stack, 
  Text
} from "@mantine/core";
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
      notifications.show({ 
        color: "gray", 
        title: "Subscribed", 
        message: "You're now subscribed to the newsletter"
      });
      setEmail("");
    } else {
      const data = await res.json();
      notifications.show({ 
        color: "gray", 
        title: "Error", 
        message: data.error || "Please try again" 
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Text size="md" c="dimmed">
            Get updates delivered to your inbox
          </Text>
          <Text size="sm" c="dimmed">
            No spam, unsubscribe anytime
          </Text>
        </Stack>
        
        <TextInput
          id="newsletter-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          size="lg"
          radius="md"
          styles={{
            input: {
              border: '2px solid #e9ecef',
              '&:focus': {
                borderColor: 'black',
              },
            },
          }}
        />
        
        <Button 
          type="submit" 
          loading={loading} 
          fullWidth
          size="lg"
          radius="md"
          color="dark"
          variant="filled"
          style={{
            backgroundColor: 'black',
          }}
        >
          Subscribe
        </Button>
      </Stack>
    </form>
  );
}
