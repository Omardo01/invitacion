import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/load-google-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const script = await loadGoogleFont("Great Vibes", "G&Z", 400);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #a07fd0, #7d5fa8)",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Script", fontSize: 62, color: "#ffffff", marginTop: 8 }}>
          G&amp;Z
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Script", data: script, style: "normal", weight: 400 }] },
  );
}
