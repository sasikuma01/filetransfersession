import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

const TRANSFER_DURATION_MS = 7_800;
const COMPLETE_PAUSE_MS = 2_000;
const CYCLE_DURATION_MS = TRANSFER_DURATION_MS + COMPLETE_PAUSE_MS;
const FILE_TRAVEL_MS = 1_350;
const FILE_STARTS = [250, 2_000, 3_750, 5_500];

const FILES = [
  { name: "Q3_Report.pdf", kind: "PDF", size: "34.6 MB" },
  { name: "Sales_Forecast.xlsx", kind: "XLSX", size: "22.8 MB" },
  { name: "Project_Brief.docx", kind: "DOCX", size: "19.4 MB" },
  { name: "Budget_Review.pdf", kind: "PDF", size: "20.0 MB" },
] as const;

const TOTAL_SIZE_MB = 96.8;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "File Transfer — Live device transfer" },
      {
        name: "description",
        content: "Watch four documents move between sender and receiver devices with live transfer progress.",
      },
      { property: "og:title", content: "File Transfer — Live device transfer" },
      {
        property: "og:description",
        content: "Watch four documents move between sender and receiver devices with live transfer progress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      setElapsedMs((performance.now() - startedAt) % CYCLE_DURATION_MS);
    }, 48);

    return () => window.clearInterval(timer);
  }, []);

  const isComplete = elapsedMs >= TRANSFER_DURATION_MS;
  const progress = Math.min(100, (elapsedMs / TRANSFER_DURATION_MS) * 100);
  const elapsedSeconds = elapsedMs / 1_000;
  const deliveredCount = FILE_STARTS.filter(
    (start) => elapsedMs >= start + FILE_TRAVEL_MS,
  ).length;
  const currentFileIndex = Math.min(deliveredCount, FILES.length - 1);
  const currentFile = FILES[currentFileIndex];
  if (!currentFile) return null;
  const transferredMb = ((TOTAL_SIZE_MB * progress) / 100).toFixed(1);
  const speed = (12.4 + Math.sin(elapsedMs / 900) * 0.4).toFixed(1);

  return (
    <main className="transfer-page">
      <section className="transfer-card" aria-label="File transfer">
        <header className="transfer-card-header">
          <div className="transfer-heading">
            <span className="transfer-mark" aria-hidden="true">
              <TransferMark />
            </span>
            <div>
              <p className="transfer-eyebrow">TRANSFER SESSION</p>
              <h1>File transfer</h1>
            </div>
          </div>
          <div className="connection-state">
            <span className="connection-dot" aria-hidden="true" />
            <span>Secure connection</span>
          </div>
        </header>

        <div className="transfer-scene-wrap">
          <DeviceScene elapsedSeconds={elapsedSeconds} />
          <div className="device-labels">
            <div className="device-label">
              <span className="device-label-overline">SENDER</span>
              <span className="device-name">MacBook Pro</span>
            </div>
            <span className="scene-transfer-count">04 FILES</span>
            <div className="device-label device-label-right">
              <span className="device-label-overline">RECEIVER</span>
              <span className="device-name">Studio laptop</span>
            </div>
          </div>
        </div>

        <section className="transfer-details" aria-label="Transfer progress">
          <div className={`file-activity${isComplete ? " is-complete" : ""}`} aria-live="polite">
            {isComplete ? (
              <>
                <span className="complete-check" aria-hidden="true">
                  <CheckMark />
                </span>
                <div className="activity-copy">
                  <p className="activity-label">Transfer complete</p>
                  <p className="activity-name">All 4 files received</p>
                </div>
              </>
            ) : (
              <>
                <span className={`file-type-badge file-kind-${currentFile.kind.toLowerCase()}`}>
                  {currentFile.kind}
                </span>
                <div className="activity-copy">
                  <p className="activity-label">Now transferring</p>
                  <p className="activity-name">{currentFile.name}</p>
                </div>
              </>
            )}
            <div className="speed-readout">
              <span className="speed-label">TRANSFER SPEED</span>
              <span className="speed-value">{speed} <small>MB/s</small></span>
            </div>
          </div>

          <div className="progress-heading">
            <span>Progress</span>
            <span className="progress-amount">
              {isComplete ? `${TOTAL_SIZE_MB.toFixed(1)} MB received` : `${transferredMb} / ${TOTAL_SIZE_MB.toFixed(1)} MB`}
            </span>
          </div>
          <div
            className="transfer-progress-track"
            role="progressbar"
            aria-label="File transfer progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className="transfer-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-footer">
            <span>{deliveredCount} of {FILES.length} files received</span>
            <span className="progress-percent">{Math.round(progress)}%</span>
          </div>
        </section>
      </section>
      <p className="transfer-footnote">A smooth handoff, from sender to receiver.</p>
    </main>
  );
}

function DeviceScene({ elapsedSeconds }: { elapsedSeconds: number }) {
  return (
    <svg
      className="transfer-scene"
      viewBox="0 0 720 260"
      role="img"
      aria-label="Four files traveling from a sender laptop into an empty receiver folder"
    >
      <defs>
        <filter id="file-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path className="transfer-path-glow" d="M 245 118 C 297 48 423 48 475 118" />
      <path className="transfer-path" d="M 245 118 C 297 48 423 48 475 118" />

      <Laptop x={32} label="Sender" isSender />
      <Laptop x={478} label="Receiver" />

      {FILES.map((file, index) => {
        const progress = Math.max(
          0,
          Math.min(1, (elapsedSeconds * 1_000 - (FILE_STARTS[index] ?? 0)) / FILE_TRAVEL_MS),
        );
        const isMoving =
          elapsedSeconds * 1_000 >= (FILE_STARTS[index] ?? 0) && progress < 1 && !Number.isNaN(progress);

        if (!isMoving) return null;

        const point = getPointOnCurve(progress);
        return (
          <g
            key={file.name}
            className={`traveling-file file-kind-${file.kind.toLowerCase()}`}
            transform={`translate(${point.x - 19} ${point.y - 24})`}
            filter="url(#file-glow)"
            aria-hidden="true"
          >
            <FileGlyph kind={file.kind} />
          </g>
        );
      })}
    </svg>
  );
}

function Laptop({ x, label, isSender = false }: { x: number; label: string; isSender?: boolean }) {
  return (
    <g className="laptop-illustration" aria-label={`${label} device`}>
      <rect className="laptop-frame" x={x} y="43" width="210" height="149" rx="12" />
      <rect className="laptop-screen" x={x + 9} y="52" width="192" height="130" rx="6" />
      <circle className="camera-dot" cx={x + 105} cy="47.5" r="1.5" />
      <rect className="screen-toolbar" x={x + 22} y="65" width="166" height="10" rx="5" />
      <circle className="screen-indicator" cx={x + 31} cy="70" r="2" />
      <rect className="screen-line" x={x + 22} y="84" width="49" height="4" rx="2" />
      <rect className="screen-line screen-line-short" x={x + 22} y="92" width="32" height="3" rx="1.5" />
      {isSender ? (
        <g className="sender-folder">
          <path className="folder-back" d={`M ${x + 75} 112 h22 l7 7 h34 a4 4 0 0 1 4 4 v26 a4 4 0 0 1-4 4 h-63 a4 4 0 0 1-4-4 v-33 a4 4 0 0 1 4-4z`} />
          <rect className="folder-document folder-document-one" x={x + 93} y="99" width="25" height="32" rx="3" />
          <rect className="folder-document folder-document-two" x={x + 108} y="104" width="25" height="32" rx="3" />
          <path className="folder-front" d={`M ${x + 72} 121 h32 l7 6 h37 a4 4 0 0 1 4 4 v18 a4 4 0 0 1-4 4 h-76 a4 4 0 0 1-4-4 v-24 a4 4 0 0 1 4-4z`} />
          <path className="folder-shine" d={`M ${x + 77} 128 h28`} />
        </g>
      ) : (
        <g className="receiver-folder">
          <path className="empty-folder" d={`M ${x + 78} 111 h25 l8 8 h38 a5 5 0 0 1 5 5 v24 a5 5 0 0 1-5 5 h-76 a5 5 0 0 1-5-5 v-32 a5 5 0 0 1 5-5z`} />
          <text className="empty-folder-label" x={x + 110} y="142" textAnchor="middle">EMPTY</text>
        </g>
      )}
      <path className="laptop-base" d={`M ${x - 14} 194 h238 l-15 12 H ${x + 15} q-22 0-29-12z`} />
      <path className="laptop-trackpad" d={`M ${x + 78} 196 h54 l-3 4 h-48z`} />
    </g>
  );
}

function FileGlyph({ kind }: { kind: string }) {
  return (
    <g className="file-glyph">
      <path className="file-sheet" d="M 7 1 h17 l11 11 v30 a3 3 0 0 1-3 3 H 7 a4 4 0 0 1-4-4 V 5 a4 4 0 0 1 4-4z" />
      <path className="file-fold" d="M 24 1 v8 a3 3 0 0 0 3 3 h8" />
      <path className="file-lines" d="M 10 19 h13 M 10 23 h17" />
      <rect className="file-kind-badge" x="1" y="29" width="34" height="13" rx="3" />
      <text className="file-kind-label" x="18" y="38" textAnchor="middle">{kind}</text>
    </g>
  );
}

function getPointOnCurve(t: number) {
  const inverse = 1 - t;
  return {
    x:
      inverse ** 3 * 245 +
      3 * inverse ** 2 * t * 297 +
      3 * inverse * t ** 2 * 423 +
      t ** 3 * 475,
    y:
      inverse ** 3 * 118 +
      3 * inverse ** 2 * t * 48 +
      3 * inverse * t ** 2 * 48 +
      t ** 3 * 118,
  };
}

function TransferMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8h13m0 0-3-3m3 3-3 3M20 16H7m0 0 3 3m-3-3 3-3" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  );
}
