/**
 * Ambient aurora background: soft drifting gradient blobs + noise grain.
 * Purely decorative — aria-hidden, pointer-events none.
 */
export function Aurora({ variant = "hero" }: { variant?: "hero" | "section" | "dashboard" }) {
  if (variant === "dashboard") {
    return (
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="aurora-blob animate-drift"
          style={{
            top: "-20%",
            right: "-10%",
            width: "55vw",
            height: "55vw",
            background:
              "radial-gradient(circle at 40% 40%, rgba(212,175,55,0.14), transparent 65%)",
          }}
        />
        <div
          className="aurora-blob animate-drift-slow"
          style={{
            bottom: "-25%",
            left: "-12%",
            width: "48vw",
            height: "48vw",
            background:
              "radial-gradient(circle at 60% 60%, rgba(212,175,55,0.16), transparent 65%)",
          }}
        />
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="aurora-blob animate-drift-slow"
          style={{
            top: "10%",
            left: "-15%",
            width: "50vw",
            height: "50vw",
            background:
              "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1), transparent 62%)",
          }}
        />
      </div>
    );
  }

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="aurora-blob animate-drift"
        style={{
          top: "-25%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle at 45% 45%, rgba(212,175,55,0.16), transparent 62%)",
        }}
      />
      <div
        className="aurora-blob animate-drift-slow"
        style={{
          top: "-10%",
          right: "-18%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle at 55% 45%, rgba(212,175,55,0.2), transparent 62%)",
        }}
      />
      <div
        className="aurora-blob animate-drift"
        style={{
          bottom: "-30%",
          left: "25%",
          width: "45vw",
          height: "45vw",
          background:
            "radial-gradient(circle at 50% 55%, rgba(110,231,183,0.14), transparent 65%)",
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}
