import { useState } from "react";

type Props = {
  frontSrc: string;
  frontAlt: string;
  backSrc: string;
  backAlt: string;
};

export default function FlipCard({ frontSrc, frontAlt, backSrc, backAlt }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped((v) => !v)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={frontSrc} alt={frontAlt} />
        </div>
        <div className="flip-card-back">
          <img src={backSrc} alt={backAlt} />
        </div>
      </div>
    </div>
  );
}
