import { useEffect, useState } from "react";
import { treeStage } from "@/lib/snappi/data";
import { useSnappi } from "@/lib/snappi/store";

// Deterministic leaf cluster positions (x, y, r) — revealed progressively by growth
const LEAVES: [number, number, number][] = [
  [100, 92, 26], [72, 104, 20], [128, 104, 20], [86, 76, 18], [116, 76, 18],
  [100, 60, 20], [58, 86, 16], [142, 86, 16], [74, 58, 15], [126, 58, 15],
  [100, 40, 16], [48, 108, 14], [152, 108, 14], [62, 66, 13], [138, 66, 13],
  [86, 42, 12], [114, 42, 12], [40, 92, 11], [160, 92, 11], [100, 26, 11],
];

export function SnappiTree({ snappies, size = 240 }: { snappies: number; size?: number }) {
  const { lastEarn } = useSnappi();
  const { idx } = treeStage(snappies);
  const growth = Math.min(1, snappies / 2000);
  const [pop, setPop] = useState(0);
  const [fly, setFly] = useState<number | null>(null);

  useEffect(() => {
    if (!lastEarn) return;
    setFly(lastEarn.key);
    const t = setTimeout(() => setPop(lastEarn.key), 1100);
    const t2 = setTimeout(() => setFly(null), 1500);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [lastEarn]);

  const leafCount = idx === 0 ? 0 : idx === 1 ? 3 : Math.round(5 + growth * 15);
  const trunkH = idx === 0 ? 0 : 30 + growth * 50;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute inset-[15%] rounded-full bg-leaf/20 blur-3xl animate-glow" />
      {/* floating particles */}
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          className="absolute bottom-[18%] h-1.5 w-1.5 rounded-full bg-leaf/80 animate-float-up"
          style={{ left: `${18 + i * 11}%`, animationDelay: `${i * 0.7}s` }}
        />
      ))}
      {fly && (
        <span key={fly} className="absolute left-1/2 top-1/2 -ml-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm shadow-leaf animate-fly">
          🌱
        </span>
      )}
      <svg viewBox="0 0 200 200" className="relative h-full w-full" key={pop} style={{ animation: pop ? "grow-pop .9s ease-out" : undefined }}>
        <ellipse cx="100" cy="182" rx="62" ry="8" className="fill-leaf/15" />
        <path d="M44 182 Q100 168 156 182" className="fill-bark/60" />
        {idx === 0 ? (
          <g>
            <ellipse cx="100" cy="174" rx="9" ry="6" className="fill-bark" />
            <path d="M100 168 q2 -8 8 -10" className="stroke-leaf" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <g className="animate-sway" style={{ transformOrigin: "100px 180px" }}>
            <path
              d={`M94 180 Q97 ${180 - trunkH / 2} 98 ${180 - trunkH} L102 ${180 - trunkH} Q103 ${180 - trunkH / 2} 106 180 Z`}
              className="fill-bark"
            />
            {idx >= 2 && (
              <>
                <path d={`M99 ${180 - trunkH * 0.55} Q84 ${170 - trunkH * 0.75} 74 ${168 - trunkH}`} className="stroke-bark" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d={`M101 ${180 - trunkH * 0.6} Q116 ${170 - trunkH * 0.8} 126 ${168 - trunkH}`} className="stroke-bark" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            <g style={{ transform: `translateY(${(1 - growth) * 60}px) scale(${0.6 + growth * 0.4})`, transformOrigin: "100px 100px" }}>
              {LEAVES.slice(0, leafCount).map(([x, y, r], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y + 30}
                  r={r}
                  className={i % 3 === 0 ? "fill-leaf" : i % 3 === 1 ? "fill-esg-high/80" : "fill-leaf/70"}
                  style={{ transition: "all .8s ease-out" }}
                />
              ))}
              {idx >= 3 &&
                [[80, 110], [118, 96], [100, 78], [132, 122], [66, 128]].slice(0, idx === 4 ? 5 : 3).map(([x, y], i) => (
                  <circle key={"f" + i} cx={x} cy={y} r="3" className="fill-accent animate-glow" style={{ animationDelay: `${i * 0.5}s` }} />
                ))}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
