"use client";

import React from "react";
import { Container, Stack } from "@mantine/core";
import { Header } from "@/components/sections/Header";
import { MainContentGrid } from "@/components/sections/MainContentGrid";
import { PostsSections } from "@/components/sections/PostsSections";

export default function NewsletterHome() {
  return (
    <Container size="lg" py={40}>
      <Stack gap={80}>
        <Header />
        <MainContentGrid />
        <PostsSections />
      </Stack>
    </Container>
  );
}
