import { notFound } from "next/navigation";
import { getGuestBySlug } from "@/lib/guests";
import Invitation33 from "@/components/invitation-33";

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  if (!guest) notFound();

  return (
    <Invitation33
      mode="live"
      guestName={guest.name}
      slug={guest.slug}
      seats={guest.seats}
      initialConfirmed={guest.confirmed}
    />
  );
}
