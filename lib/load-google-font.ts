/**
 * Descarga una fuente de Google Fonts en formato TrueType, apta para `next/og`.
 * satori (el motor de ImageResponse) NO admite woff2, así que se fuerza TrueType
 * con un User-Agent antiguo y se sub-divide la fuente al `text` que se va a usar.
 */
export async function loadGoogleFont(
  family: string,
  text: string,
  weight = 400,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;

  const css = await (
    await fetch(url, {
      headers: {
        // UA antiguo → Google devuelve TrueType (satori no soporta woff2).
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Version/5.0 Safari/534.30",
      },
    })
  ).text();

  const src = css.match(/src:\s*url\((.+?)\)\s*format\(['"]?(?:opentype|truetype)['"]?\)/);
  if (!src?.[1]) throw new Error(`No se encontró la fuente TrueType para «${family}»`);

  const res = await fetch(src[1]);
  if (!res.ok) throw new Error(`No se pudo descargar la fuente «${family}»`);
  return res.arrayBuffer();
}
