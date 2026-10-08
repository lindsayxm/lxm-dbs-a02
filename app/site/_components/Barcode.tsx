import { code128 } from "@/lib/code128";

const QUIET = 10; // modules of blank space each side, as Code 128 requires

// Dark bars on a light plate: inverted barcodes fail on many scanners.
export function Barcode({ value }: { value: string }) {
  const modules = code128(value);
  const runs: { x: number; w: number }[] = [];
  for (let i = 0; i < modules.length; ) {
    if (modules[i] === "1") {
      let j = i;
      while (modules[j] === "1") j++;
      runs.push({ x: i + QUIET, w: j - i });
      i = j;
    } else i++;
  }
  return (
    <svg
      className="barcode-svg"
      viewBox={`0 0 ${modules.length + QUIET * 2} 50`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Barcode for ticket number ${value}`}
    >
      <rect width="100%" height="100%" fill="var(--barcode-paper, #fff)" />
      {runs.map((r) => (
        <rect key={r.x} x={r.x} y={0} width={r.w} height={50} fill="var(--barcode-ink, #000)" />
      ))}
    </svg>
  );
}
