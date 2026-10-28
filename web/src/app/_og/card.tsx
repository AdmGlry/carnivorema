import { ImageResponse } from "next/og";
import { ACCENT, SITE_NAME, THEME_LIGHT } from "../_site";

export const OG_SIZE = { width: 1200, height: 630 };

// Carte Open Graph commune : titre, sous-titre et nom du site.
export function ogCard({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: THEME_LIGHT,
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: ACCENT,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#1c1410" }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 2 }}>{kicker}</div>
          <div style={{ marginTop: 16, fontSize: 68, fontWeight: 800, color: "#1c1410", lineHeight: 1.1 }}>{title}</div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#6b5d55" }}>{subtitle}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
