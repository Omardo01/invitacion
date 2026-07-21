import { NextResponse } from "next/server";
import { getMerchItems, getMerchRecipients } from "@/lib/merch";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const [items, recipients] = await Promise.all([getMerchItems(), getMerchRecipients()]);
  return NextResponse.json({ items, recipients });
}
