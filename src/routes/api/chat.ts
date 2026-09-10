import { createFileRoute } from "@tanstack/react-router";
import { generateKisanChatResponse } from "@/lib/gemini";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: any) => {
        try {
          const body = await request.json();
          const { message, history = [], contextData } = body;

          if (!message || typeof message !== "string") {
            return new Response(JSON.stringify({ error: "Missing message in request body" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const reply = await generateKisanChatResponse(message, history, contextData);

          return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (err: any) {
          console.error("Kisan Queue AI Chat Error:", err);
          return new Response(JSON.stringify({ error: err?.message || "AI failed to respond" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
