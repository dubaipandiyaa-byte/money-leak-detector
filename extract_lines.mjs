import { readFileSync } from "fs";
globalThis.DOMMatrix = class DOMMatrix {
  constructor() { this.a=1;this.b=0;this.c=0;this.d=1;this.e=0;this.f=0; }
  multiply() { return this; }
  translate() { return this; }
  scale() { return this; }
};
globalThis.Path2D = class Path2D {};

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

const data = new Uint8Array(readFileSync(process.argv[2]));
const doc = await pdfjs.getDocument({ data, disableWorker: true, useWorkerFetch: false }).promise;
const lines = [];

for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const content = await page.getTextContent();
  const rows = new Map();
  for (const item of content.items) {
    if (!("str" in item) || !item.str.trim()) continue;
    const y = Math.round(item.transform[5]);
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
  const sorted = [...rows.entries()].sort((a, b) => b[0] - a[0]);
  for (const [, items] of sorted) {
    lines.push(
      items.sort((a, b) => a.x - b.x).map((i) => i.str).join(" ").replace(/\s+/g, " ").trim()
    );
  }
}

console.log(JSON.stringify(lines, null, 0));
