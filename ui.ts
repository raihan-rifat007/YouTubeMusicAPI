// Auto-generated: UI served from ui.html
let _cached: string | null = null;

export function getHtml(): string {
  if (_cached) return _cached;
  try {
    const path = new URL("./ui.html", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
    _cached = Deno.readTextFileSync(path);
    return _cached;
  } catch {
    return "<h1>UI not found</h1>";
  }
}

// Legacy export for compatibility
export const html = getHtml();
