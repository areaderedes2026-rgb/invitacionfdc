"use client";

import Image from "next/image";

export function CoverMedia({
  src,
  onError,
  priority = false,
  native = false,
}: {
  src: string;
  onError: () => void;
  priority?: boolean;
  native?: boolean;
}) {
  const remote = /^https?:\/\//i.test(src);
  const usable = Boolean(src?.trim()) && (remote || src.startsWith("/") || src.startsWith("data:"));

  if (!usable) return null;

  if (native || remote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        onError={onError}
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      className="object-cover object-center"
      sizes="100vw"
      quality={85}
      onError={onError}
    />
  );
}
