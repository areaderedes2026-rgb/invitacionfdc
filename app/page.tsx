import { InvitationExperience } from "@/components/experience/invitation-experience";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const config = await getSiteConfig();
  return <InvitationExperience config={config} />;
}
