import { notFound } from "next/navigation";
import { getGuestBySlug } from "@/lib/guests";
import { wedding } from "@/lib/wedding";
import InvitationClient from "./InvitationClient";

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);
  if (!guest) notFound();

  return (
    <InvitationClient
      guest={{
        id: guest.id,
        slug: guest.slug,
        name: guest.name,
        seats: guest.seats,
        confirmed: guest.confirmed,
        notes: guest.notes,
      }}
      wedding={{
        bride: wedding.bride,
        groom: wedding.groom,
        dateLabel: wedding.dateLabel,
        dateShort: wedding.dateShort,
        city: wedding.city,
        ceremony: wedding.ceremony,
        reception: wedding.reception,
        dressCode: wedding.dressCode,
        rsvpDeadline: wedding.rsvpDeadline,
        hashtag: wedding.hashtag,
        story: wedding.story,
      }}
    />
  );
}
