const CACHE_NAME = "lineare-algebra-cache-v30";
const KATEX_BASE = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./app.math.js",
  "./app.tools.js",
  "./app.progress.js",
  "./app.quiz.js",
  "./app.viz.js",
  "./app.render.js",
  "./data/learningPath.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./og-image.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./robots.txt",
  "./sitemap.xml",
  "./llms.txt",
  "./llms-full.txt"
];
const OPTIONAL_ASSETS = [
  `${KATEX_BASE}katex.min.css`,
  `${KATEX_BASE}katex.min.js`,
  `${KATEX_BASE}contrib/auto-render.min.js`,
  ...[
    "KaTeX_AMS-Regular.woff2",
    "KaTeX_Caligraphic-Bold.woff2",
    "KaTeX_Caligraphic-Regular.woff2",
    "KaTeX_Fraktur-Bold.woff2",
    "KaTeX_Fraktur-Regular.woff2",
    "KaTeX_Main-Bold.woff2",
    "KaTeX_Main-BoldItalic.woff2",
    "KaTeX_Main-Italic.woff2",
    "KaTeX_Main-Regular.woff2",
    "KaTeX_Math-BoldItalic.woff2",
    "KaTeX_Math-Italic.woff2",
    "KaTeX_SansSerif-Bold.woff2",
    "KaTeX_SansSerif-Italic.woff2",
    "KaTeX_SansSerif-Regular.woff2",
    "KaTeX_Script-Regular.woff2",
    "KaTeX_Size1-Regular.woff2",
    "KaTeX_Size2-Regular.woff2",
    "KaTeX_Size3-Regular.woff2",
    "KaTeX_Size4-Regular.woff2",
    "KaTeX_Typewriter-Regular.woff2"
  ].map((font) => `${KATEX_BASE}fonts/${font}`)
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        await cache.addAll(APP_ASSETS);
        await Promise.allSettled(OPTIONAL_ASSETS.map((asset) => cache.add(asset)));
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  const cacheableOrigin = requestUrl.origin === self.location.origin || requestUrl.hostname === "cdn.jsdelivr.net";
  if (!cacheableOrigin) return;

  const networkPromise = fetch(event.request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, networkResponse.clone());
    }
    return networkResponse;
  });
  event.waitUntil(networkPromise.then(() => undefined).catch(() => undefined));
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => cachedResponse || networkPromise)
      .catch(() => {
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
