export function plainText(value: string) {
  const entities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(
      /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
      (whole, entity: string) => {
        if (entity.startsWith("#")) {
          const code =
            entity[1].toLowerCase() === "x"
              ? parseInt(entity.slice(2), 16)
              : parseInt(entity.slice(1), 10);
          return code > 0 && code <= 0x10ffff
            ? String.fromCodePoint(code)
            : whole;
        }
        return entities[entity.toLowerCase()] || whole;
      },
    )
    .replace(/\s+/g, " ")
    .trim();
}
export function keywordHits(text: string, keywords: string[]) {
  const normalized = text.replace(/[‐‑–—-]/g, " ").replace(/\s+/g, " ");
  return keywords.filter((k) =>
    new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`, "i").test(
      normalized,
    ),
  );
}
export function downloadText(filename: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readTextFile(file: Pick<File, "name" | "size" | "text">) {
  if (!/\.(txt|md)$/i.test(file.name) || file.size > 200000) {
    throw new Error("Choose a .txt or .md file smaller than 200 KB.");
  }
  const content = await file.text();
  return { text: content.slice(0, 50000), truncated: content.length > 50000 };
}
