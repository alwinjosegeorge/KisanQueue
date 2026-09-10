export default async function handler(req: any, res: any) {
  try {
    const { tl = "ml", text = "" } = req.query || {};
    if (!text) {
      res.status(400).send("Missing text");
      return;
    }

    const cleanText = (typeof text === "string" ? text : String(text)).slice(0, 180);
    const lang = typeof tl === "string" ? tl : "ml";

    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
      lang
    )}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const upstream = await fetch(googleTtsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!upstream.ok) {
      res.status(upstream.status).send("TTS Upstream Error");
      return;
    }

    const arrayBuf = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(buffer);
  } catch (err: any) {
    res.status(500).send(err?.message || "Internal Server Error");
  }
}
