"use client";

import Image from "next/image";

export function CoverMedia({
  src,
  onError,
  priority = false,
}: {
  src: string;
  onError: () => void;
  priority?: boolean;
}) {
  const remote = /^https?:\/\//i.test(src);

  if (remote) {
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
