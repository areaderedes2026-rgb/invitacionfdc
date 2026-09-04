"use client";

import { extractYoutubeId, youtubeEmbedUrl } from "@/lib/youtube";
import type { SiteConfig } from "@/types";

export function VideoSection({ config }: { config: SiteConfig }) {
  if (!config.video_url) return null;

  const youtubeId = extractYoutubeId(config.video_url);
  const youtubeSrc = youtubeId ? youtubeEmbedUrl(config.video_url) : "";

  return (
    <section id="video" className="py-16" aria-labelledby="video-title">
      <div className="mx-auto max-w-5xl px-6">
        <h2
          id="video-title"
          data-gsap="fade-up"
          className="mb-8 text-center font-display text-3xl tracking-[0.08em]"
        >
          Video institucional
        </h2>
        <div
          data-gsap="clip-left"
          className="institutional-card overflow-hidden rounded-[2rem]"
        >
          <div className="relative aspect-video w-full bg-ink">
            {youtubeId ? (
              <iframe
                title="Video institucional"
                src={youtubeSrc}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                className="h-full w-full object-cover"
                controls
                preload="metadata"
                src={config.video_url}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
