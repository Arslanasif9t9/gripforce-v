import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ErrorBox, adminInputClass } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/admin-utils";
import { dbErrorMessage } from "@/lib/admin-products";

export const Route = createFileRoute("/admin/support")({
  component: SupportPage,
});

type Message = Database["public"]["Tables"]["support_messages"]["Row"];
const STATUSES = ["open", "in_progress", "closed"] as const;
const LABEL: Record<string, string> = { open: "Open", in_progress: "In progress", closed: "Closed" };
const BADGE: Record<string, string> = {
  open: "bg-destructive/15 text-destructive",
  in_progress: "bg-primary/15 text-primary",
  closed: "bg-secondary text-muted-foreground",
};

function SupportPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("open");
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messages = useQuery({
    queryKey: ["admin-support"],
    queryFn: async (): Promise<Message[]> => {
      const { data, error: err } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      return data;
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-support"] });
    qc.invalidateQueries({ queryKey: ["admin-count", "support_messages"] });
  };

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error: err } = await supabase
        .from("support_messages")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (err) throw err;
    },
    onSuccess: () => {
      setError(null);
      refresh();
    },
    onError: (e: { code?: string; message: string }) => setError(dbErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase.from("support_messages").delete().eq("id", id);
      if (err) throw err;
    },
    onSuccess: () => {
      setOpenId(null);
      refresh();
    },
    onError: (e: { code?: string; message: string }) => setError(dbErrorMessage(e)),
  });

  const all = messages.data ?? [];
  const rows = filter === "all" ? all : all.filter((m) => m.status === filter);
  const count = (s: string) => all.filter((m) => m.status === s).length;

  return (
    <div>
      <h1 className="heading-section">Support</h1>
      <p className="mt-2 text-sm text-muted-foreground">Messages from the Contact page. Reply by email, then set the status.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status" className={`${adminInputClass} max-w-xs`}>
          <option value="all">All ({all.length})</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {LABEL[s]} ({count(s)})
            </option>
          ))}
        </select>
      </div>

      {error && <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>}
      {messages.isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {messages.isError && <p className="mt-6 text-sm text-destructive">Could not load messages.</p>}
      {messages.data && rows.length === 0 && (
        <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">No messages here.</p>
      )}

      <div className="mt-5 grid gap-3">
        {rows.map((m) => {
          const open = openId === m.id;
          return (
            <article key={m.id} className="rounded-xl border border-border bg-card">
              <button
                className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : m.id)}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{m.subject}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {m.customer_name} · {m.customer_email} · {formatDateTime(m.created_at)}
                  </span>
                </span>
                <span className={`rounded px-2 py-0.5 text-xs ${BADGE[m.status] ?? BADGE["closed"]}`}>{LABEL[m.status] ?? m.status}</span>
              </button>
              {open && (
                <div className="border-t border-border p-4">
                  {/* Plain text only: React escapes it, so customer text can never run as code. */}
                  <p className="whitespace-pre-wrap break-words text-sm">{m.message}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {/* Direct Gmail compose window */}
                    <a
                      className="btn-neon text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.customer_email)}&su=${encodeURIComponent(`Re: ${m.subject} [Grip Force Support]`)}`}
                    >
                      Reply in Gmail ↗
                    </a>
                  
                    {/* Quick copy email */}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(m.customer_email);
                        alert(`Copied ${m.customer_email} to clipboard!`);
                      }}
                      className="btn-outline-dark text-xs py-2 px-3"
                    >
                      Copy Email
                    </button>
                  
                    <a
                      className="text-xs text-muted-foreground underline"
                      href={`mailto:${encodeURIComponent(m.customer_email)}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                    >
                      Default Mail App
                    </a>

                    <select
                      value={m.status}
                      onChange={(e) => setStatus.mutate({ id: m.id, status: e.target.value })}
                      aria-label="Change status"
                      className={`${adminInputClass} max-w-[11rem]`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {LABEL[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-sm text-destructive underline"
                      onClick={() => {
                        if (window.confirm("Delete this message forever?")) remove.mutate(m.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
