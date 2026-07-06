const STORAGE_KEY = "mini-duopy.examples";

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(text) {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function encodePayload(payload) {
  const json = JSON.stringify(payload);
  return bytesToBase64(new TextEncoder().encode(json))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function decodePayload(token) {
  if (!token) return null;
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const json = new TextDecoder().decode(base64ToBytes(base64 + padding));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function makePlayUrl(payload, baseHref = new URL("./play.html", window.location.href)) {
  const url = new URL(baseHref);
  url.hash = `state=${encodePayload(payload)}`;
  return url.toString();
}

export function makeIframeSnippet(url, height = 760) {
  return `<iframe src="${url}" width="100%" height="${height}" style="border:0; border-radius:14px; overflow:hidden;" title="Mini Duo Python"></iframe>`;
}

export function slugify(input) {
  return String(input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "example";
}

export function escapeHtml(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temp = document.createElement("textarea");
  temp.value = text;
  temp.setAttribute("readonly", "true");
  temp.style.position = "fixed";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  temp.remove();
}

function readLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLibrary(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listExamples() {
  return readLibrary().sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0));
}

export function getExample(slug) {
  return readLibrary().find((item) => item.slug === slug) || null;
}

export function upsertExample(example) {
  const items = readLibrary().filter((item) => item.slug !== example.slug);
  items.unshift({
    ...example,
    updatedAt: Date.now()
  });
  writeLibrary(items.slice(0, 40));
}

export function deleteExample(slug) {
  const items = readLibrary().filter((item) => item.slug !== slug);
  writeLibrary(items);
}

export function buildExportWrapperUrl(payload) {
  const target = new URL("./play.html", window.location.href);
  target.hash = `state=${encodePayload(payload)}`;
  return target.toString();
}

export function buildWrapperHtml(payload) {
  const target = buildExportWrapperUrl(payload);
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(payload.title || "Mini Duo Python")}</title>
  <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
  <style>
    body { font-family: system-ui, sans-serif; background: #0b1220; color: #e8f0ff; display: grid; place-items: center; min-height: 100vh; margin: 0; }
    a { color: #8cff7f; }
  </style>
</head>
<body>
  <main>
    <p>Redirigiendo al mini Duo Python...</p>
    <p>Si no ocurre, abre <a href="${escapeHtml(target)}">este enlace</a>.</p>
  </main>
</body>
</html>`;
}
