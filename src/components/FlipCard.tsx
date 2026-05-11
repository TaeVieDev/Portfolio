import { useState } from "react";

// Props typées : on déclare la forme attendue de l'objet passé au composant.
// L'avantage de TS = si on oublie une prop, le compilateur gueule.
type Props = {
  frontSrc: string;
  frontAlt: string;
  backSrc: string;
  backAlt: string;
};

// Composant réutilisable : il prend ses données via props → on peut le réutiliser
// avec d'autres images sans le réécrire.
// La déstructuration { frontSrc, frontAlt, ... } extrait directement les props par nom.
export default function FlipCard({ frontSrc, frontAlt, backSrc, backAlt }: Props) {
  // État booléen : la carte est retournée ou pas.
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      // className dynamique via template string : ajoute "flipped" seulement quand flipped===true.
      className={`flip-card ${flipped ? "flipped" : ""}`}
      // Pattern setter avec fonction : setFlipped((v) => !v) lit la valeur précédente.
      // Plus sûr que setFlipped(!flipped) si plusieurs updates s'enchaînent rapidement.
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
