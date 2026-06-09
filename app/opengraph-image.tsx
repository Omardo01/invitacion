import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/load-google-font";

export const alt = "Gabriel & Zayra · Nuestra boda · 25 de julio de 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Caracteres usados en cada tipografía (para sub-dividir la fuente al mínimo).
const SCRIPT_TEXT = "Gabriel & Zayra GZ&";
const SERIF_TEXT = "NUESTRA BODA 25 DE JULIO 2026 VILLAHERMOSA, TABASCO";

export default async function OpengraphImage() {
  const [script, serif] = await Promise.all([
    loadGoogleFont("Great Vibes", SCRIPT_TEXT, 400),
    loadGoogleFont("Cormorant Garamond", SERIF_TEXT, 600),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Serif",
          background:
            "linear-gradient(135deg, #faf8fd 0%, #efe9f8 55%, #e6ddf3 100%)",
          position: "relative",
        }}
      >
        {/* marco interior */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "2px solid rgba(138,108,184,0.32)",
            borderRadius: 10,
            display: "flex",
          }}
        />

        {/* badge monograma */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 116,
            height: 116,
            borderRadius: 28,
            background: "linear-gradient(135deg, #a07fd0, #7d5fa8)",
            boxShadow: "0 22px 44px -18px rgba(120,90,170,0.65)",
            marginBottom: 30,
          }}
        >
          <div style={{ display: "flex", fontFamily: "Script", fontSize: 74, color: "#ffffff", marginTop: 10 }}>
            G&amp;Z
          </div>
        </div>

        {/* kicker */}
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 16, color: "#8a6cb8", marginBottom: 4 }}>
          NUESTRA BODA
        </div>

        {/* nombres */}
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Script" }}>
          <div style={{ display: "flex", fontSize: 152, color: "#352c4e" }}>Gabriel</div>
          <div style={{ display: "flex", fontSize: 152, color: "#9a7bc8", margin: "0 24px" }}>&amp;</div>
          <div style={{ display: "flex", fontSize: 152, color: "#352c4e" }}>Zayra</div>
        </div>

        {/* divisor */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 16, marginBottom: 18 }}>
          <div style={{ width: 96, height: 1, background: "#cbbce4" }} />
          <div style={{ width: 11, height: 11, background: "#8a6cb8", transform: "rotate(45deg)", margin: "0 16px" }} />
          <div style={{ width: 96, height: 1, background: "#cbbce4" }} />
        </div>

        {/* fecha */}
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 12, color: "#6c628a" }}>
          25 DE JULIO DE 2026
        </div>

        {/* ciudad */}
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 7, color: "#a79ec0", marginTop: 16 }}>
          VILLAHERMOSA, TABASCO
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Script", data: script, style: "normal", weight: 400 },
        { name: "Serif", data: serif, style: "normal", weight: 600 },
      ],
    },
  );
}
