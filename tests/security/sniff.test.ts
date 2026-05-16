import { describe, it, expect } from "vitest";

/**
 * The upload-route MIME sniffer is defined inline in route.ts. We re-derive
 * it here from the same magic-byte rules so we can unit-test the security
 * contract: only the seven allowed formats pass, everything else is
 * rejected.
 *
 * If you change the sniff() function in src/app/api/admin/upload/route.ts,
 * mirror the change here.
 */
function sniff(buf: Buffer): { mime: string; ext: string } | null {
  if (buf.length < 12) return null;
  const b = buf;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { mime: "image/png", ext: "png" };
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return { mime: "image/webp", ext: "webp" };
  if (b.subarray(4, 8).toString() === "ftyp") {
    const brand = b.subarray(8, 12).toString();
    if (brand === "avif" || brand === "avis") return { mime: "image/avif", ext: "avif" };
    if (brand === "mp42" || brand === "isom" || brand === "iso2" || brand === "mp41") return { mime: "video/mp4", ext: "mp4" };
  }
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return { mime: "video/webm", ext: "webm" };
  return null;
}

function bufWith(prefix: number[], pad = 16): Buffer {
  const b = Buffer.alloc(prefix.length + pad);
  Buffer.from(prefix).copy(b, 0);
  return b;
}

describe("upload sniff()", () => {
  it("accepts JPEG", () => {
    expect(sniff(bufWith([0xff, 0xd8, 0xff, 0xe0]))?.mime).toBe("image/jpeg");
  });
  it("accepts PNG", () => {
    expect(sniff(bufWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))?.mime).toBe("image/png");
  });
  it("accepts WebP", () => {
    const b = Buffer.alloc(20);
    Buffer.from("RIFF").copy(b, 0);
    Buffer.from("WEBP").copy(b, 8);
    expect(sniff(b)?.mime).toBe("image/webp");
  });
  it("accepts AVIF", () => {
    const b = Buffer.alloc(16);
    Buffer.from("ftyp").copy(b, 4);
    Buffer.from("avif").copy(b, 8);
    expect(sniff(b)?.mime).toBe("image/avif");
  });
  it("accepts MP4", () => {
    const b = Buffer.alloc(16);
    Buffer.from("ftyp").copy(b, 4);
    Buffer.from("isom").copy(b, 8);
    expect(sniff(b)?.mime).toBe("video/mp4");
  });
  it("accepts WebM", () => {
    expect(sniff(bufWith([0x1a, 0x45, 0xdf, 0xa3]))?.mime).toBe("video/webm");
  });

  it("rejects SVG (text content)", () => {
    const svg = Buffer.from('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>');
    expect(sniff(svg)).toBeNull();
  });
  it("rejects HTML", () => {
    expect(sniff(Buffer.from("<!DOCTYPE html><html><script>alert(1)</script></html>"))).toBeNull();
  });
  it("rejects a JPEG-looking GIF (right ext, wrong bytes)", () => {
    expect(sniff(bufWith([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]))).toBeNull();
  });
  it("rejects buffers shorter than 12 bytes", () => {
    expect(sniff(Buffer.from([0xff, 0xd8, 0xff]))).toBeNull();
  });
  it("rejects an empty buffer", () => {
    expect(sniff(Buffer.alloc(0))).toBeNull();
  });
});
