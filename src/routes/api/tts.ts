import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      GET: async ({ request }: any) => {
        try {
          const url = new URL(request.url);
          const tl = url.searchParams.get("tl") || "ml";
          const text = url.searchParams.get("text") || "";
          if (!text) return new Response("Missing text", { status: 400 });

          const cleanText = text.slice(0, 180);
          const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
            tl
          )}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

          const ttsRes = await fetch(googleTtsUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });

          if (!ttsRes.ok) return new Response("TTS error", { status: ttsRes.status });

          const buf = await ttsRes.arrayBuffer();
          return new Response(buf, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (e: any) {
          return new Response("Server error", { status: 500 });
        }
      },
    },
  },
});
