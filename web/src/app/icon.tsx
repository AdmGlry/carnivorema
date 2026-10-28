import { ImageResponse } from "next/og";
import { ACCENT } from "./_site";

export const contentType = "image/png";

export function generateImageMetadata() {
  return [32, 192, 512].map((s) => ({ id: String(s), size: { width: s, height: s }, contentType }));
}

// Icône générée : un « M » blanc sur l'accent. Les grandes tailles restent carrées pour l'usage « maskable ».
export default async function Icon({ id }: { id: Promise<string> | string }) {
  const s = Number(await id);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ACCENT,
          color: "#fff",
          fontSize: s * 0.6,
          fontWeight: 800,
          borderRadius: s >= 192 ? 0 : s * 0.2,
        }}
      >
        M
      </div>
    ),
    { width: s, height: s },
  );
}
