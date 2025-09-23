"use client";

import { useState } from "react";
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
        color: "green", 
        title: "Subscribed", 
        message: "You're now subscribed to the newsletter"
      });
      setEmail("");
    } else {
      const data = await res.json();
      notifications.show({ 
        color: "red", 
        title: "Error", 
        message: data.error || "Please try again" 
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Get updates delivered to your inbox
        </Text>
        
        <TextInput
          id="newsletter-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          size="md"
        />
        
        <Button 
          type="submit" 
          loading={loading} 
          fullWidth
          size="md"
          color="dark"
          variant="filled"
        >
          Subscribe
        </Button>
        
        <Text size="xs" c="dimmed">
          No spam, unsubscribe anytime
        </Text>
      </Stack>
    </form>
  );
}
