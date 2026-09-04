export function extractYoutubeId(url: string): string | null {
  const value = url.trim();
  if (!value) return null;

  const fromPath = (pathname: string, markers: string[]) => {
    const parts = pathname.split("/").filter(Boolean);
    const index = parts.findIndex((part) => markers.includes(part));
    const id = index >= 0 ? parts[index + 1] : parts[0];
    return id?.replace(/[^a-zA-Z0-9_-]/g, "") || null;
  };

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");

    if (host === "youtu.be") {
      return fromPath(parsed.pathname, []);
    }

    if (
      host === "youtube.com" ||
      host === "youtube-nocookie.com" ||
      host === "music.youtube.com"
    ) {
      const queryId = parsed.searchParams.get("v");
      if (queryId) return queryId.replace(/[^a-zA-Z0-9_-]/g, "") || null;
      return fromPath(parsed.pathname, ["embed", "shorts", "live", "v"]);
    }
  } catch {
    /* not a URL */
  }

  const fallback =
    value.match(/youtu\.be\/([\w-]{6,})/)?.[1] ||
    value.match(/[?&]v=([\w-]{6,})/)?.[1] ||
    value.match(/youtube\.com\/(?:embed|shorts|live)\/([\w-]{6,})/)?.[1];

  return fallback || null;
}

export function youtubeEmbedUrl(url: string) {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url.trim();
}

export function youtubeThumbUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}
