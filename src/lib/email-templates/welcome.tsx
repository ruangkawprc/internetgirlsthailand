import * as React from "react";
import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

const WelcomeEmail = () => (
  <Html lang="en">
    <Head />
    <Preview>Welcome to Internet Girls Thailand</Preview>
    <Body style={{ backgroundColor: "#ffffff", fontFamily: "Inter, Arial, sans-serif", margin: 0 }}>
      <Container style={{ padding: "32px 24px", maxWidth: "520px" }}>
        <Heading style={{ color: "#5b3bb5", fontSize: "26px", margin: "0 0 16px" }}>
          Welcome to Internet Girls Thailand
        </Heading>
        <Text style={{ color: "#1a1a1a", fontSize: "15px", lineHeight: "24px" }}>
          Thank you for joining our community. We're making AI accessible to more women in Thailand, and we're so glad you're here.
        </Text>
        <Text style={{ color: "#1a1a1a", fontSize: "15px", lineHeight: "24px" }}>
          You'll be the first to know about upcoming events and ways to learn, build and connect.
        </Text>
        <Text style={{ color: "#1a1a1a", fontSize: "15px", lineHeight: "24px" }}>
          In the meantime, follow us on{" "}
          <Link href="https://www.instagram.com/internetgirls.th/" style={{ color: "#5b3bb5" }}>Instagram</Link>.
        </Text>
        <Text style={{ color: "#666666", fontSize: "13px", marginTop: "28px" }}>Internet Girls Thailand</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: WelcomeEmail,
  subject: "Welcome to Internet Girls Thailand",
  displayName: "Waitlist welcome",
  previewData: {},
} satisfies TemplateEntry;
