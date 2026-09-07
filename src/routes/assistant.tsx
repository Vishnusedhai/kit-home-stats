import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant (preview) — HomeLab Dashboard" },
      {
        name: "description",
        content:
          "A preview of the upcoming homelab assistant: ask what to monitor, explain Linux services and get hardening tips.",
      },
      { property: "og:title", content: "AI Assistant (preview) — HomeLab Dashboard" },
      {
        property: "og:description",
        content: "A preview of the upcoming homelab assistant. Not connected yet.",
      },
    ],
  }),
  component: AssistantPage,
});

const suggestions = [
  "What should I monitor on my server?",
  "Explain this Linux service.",
  "How do I harden SSH on a public-facing box?",
  "Suggest a backup strategy for my NAS.",
];

function AssistantPage() {
  const [draft, setDraft] = useState("");

  return (
    <>
      <PageHeader
        title="AI Assistant"
        description="Preview of an upcoming feature. Nothing is sent anywhere — responses are not available yet."
      />

      <div className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Not connected in v1</p>
          <p className="mt-1 text-muted-foreground">
            This panel is a placeholder for a future assistant that will read your device
            inventory and answer questions about it. It is intentionally offline for now.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <span className="mono-label">conversation</span>
        </div>

        <div className="grid-backdrop flex min-h-56 flex-col items-center justify-center gap-2 p-8 text-center">
          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-card text-primary">
            <Sparkles className="size-4" />
          </div>
          <p className="text-sm font-medium text-foreground">No messages yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Pick a suggested prompt below to see how the assistant will work once it's
            wired up.
          </p>
        </div>

        <div className="border-t border-border p-4">
          <div className="mono-label">suggested prompts</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDraft(s)}
                className="rounded-md border border-border bg-muted/40 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about your homelab…"
              aria-label="Message the assistant"
            />
            <Button type="submit" disabled title="Coming soon">
              <Send className="size-4" />
              Send
            </Button>
          </form>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">
            sending is disabled in v1
          </p>
        </div>
      </div>
    </>
  );
}
