import { notFound } from "next/navigation";
import { InvitationExperience } from "@/components/experience/invitation-experience";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SpecialInvitePage({ params }: PageProps) {
  const { slug } = await params;
  const config = await getSiteConfig();
  const link = config.enlaces.find((item) => item.slug === slug && item.activo);

  if (!link) notFound();

  return <InvitationExperience config={config} enlaceSlug={slug} />;
}
