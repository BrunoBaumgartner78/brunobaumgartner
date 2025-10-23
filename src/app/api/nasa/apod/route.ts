// src/app/api/nasa/apod/route.ts
export const runtime = "nodejs"; // wichtig: keine Edge-Runtime

export async function GET() {
  try {
    const apiKey =
      process.env.NASA_API_KEY ||
      process.env.NEXT_PUBLIC_NASA_API_KEY ||
      process.env.REACT_APP_NASA_API_KEY ||
      "DEMO_KEY";

    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=true`;

    // Auf dem Server ist CSP des Browsers egal — hier darfst du extern fetchen.
    const res = await fetch(url, {
      // 6h Cache beim Host (Vercel etc.), Browser bekommt SWR
      next: { revalidate: 21600 },
      // Optional: Timeout/Sicherheit (Node-18+ AbortController wenn gewünscht)
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "NASA APOD request failed", status: res.status }),
        { status: res.status, headers: { "content-type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "s-maxage=21600, stale-while-revalidate",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Proxy error", detail: String(err?.message || err) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
