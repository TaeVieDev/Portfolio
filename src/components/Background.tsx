import { useEffect, useRef } from "react";

export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const squares = containerRef.current?.querySelectorAll<HTMLDivElement>(".square");
    if (!squares) return;

    const handlers: Array<{ el: HTMLDivElement; fn: () => void }> = [];
    squares.forEach((square) => {
      const startY = Math.random() * 100;
      square.style.bottom = startY + "vh";

      const onIter = () => {
        const randomX = (Math.random() - 0.5) * 100;
        square.style.transform = `translateX(${randomX}px)`;
      };
      square.addEventListener("animationiteration", onIter);
      handlers.push({ el: square, fn: onIter });
    });

    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener("animationiteration", fn));
    };
  }, []);

  return (
    <div className="bg-decor" ref={containerRef}>
      <div className="particles">
        <div className="squares">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="square" />
          ))}
        </div>
      </div>
      <div className="back" />
    </div>
  );
}
