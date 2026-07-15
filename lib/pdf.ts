/**
 * Client-side PDF text extraction via pdf.js. Text items on each page are
 * grouped into visual lines by their y-coordinate so table rows come out as
 * single strings the statement parser can read. Runs entirely in the browser.
 */
export async function extractPdfLines(data: ArrayBuffer): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  const lines: string[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();

    // group items by rounded y position (PDF y grows upward)
    const rows = new Map<number, { x: number; str: string }[]>();
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const y = Math.round(item.transform[5]);
      // merge with an existing row within 2 units (handles sub-pixel jitter)
      let key = y;
      for (const existing of rows.keys()) {
        if (Math.abs(existing - y) <= 2) {
          key = existing;
          break;
        }
      }
      const row = rows.get(key) ?? [];
      row.push({ x: item.transform[4], str: item.str });
      rows.set(key, row);
    }

    const sorted = [...rows.entries()].sort((a, b) => b[0] - a[0]); // top → bottom
    for (const [, items] of sorted) {
      lines.push(
        items
          .sort((a, b) => a.x - b.x)
          .map((i) => i.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
      );
    }
  }

  await loadingTask.destroy();
  return lines;
}
