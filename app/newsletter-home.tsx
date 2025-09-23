"use client";
import dynamic from "next/dynamic";

const NewsletterSignup = dynamic(() => import("./newsletter-signup"));
const AuthorPost = dynamic(() => import("./author-post"));
const ViewPosts = dynamic(() => import("./view-posts"));

export default function NewsletterHome() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>Personal Newsletter</h1>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <NewsletterSignup />
        </div>
        <div style={{ flex: 2, minWidth: 320 }}>
          <AuthorPost />
        </div>
      </div>
      <div style={{ marginTop: 48 }}>
        <ViewPosts />
      </div>
    </div>
  );
}
