import { useState } from "react";

// Props typées : on déclare la forme attendue de l'objet passé au composant.
// On dit objet et pas paramètre car en JSX on passe un objet avec des propriétés (props) au composant.
// Ici, on attend un objet avec 4 propriétés : frontSrc, frontAlt, backSrc et backAlt, toutes de type string.
// L'avantage de TS = si on oublie une prop, le compilateur gueule.
type Props = {
  frontSrc: string; // URL de l'image à afficher sur le recto de la carte
  frontAlt: string; // Texte alternatif pour l'image du recto (important pour l'accessibilité)
  backSrc: string; // URL de l'image à afficher sur le verso de la carte
  backAlt: string; // Texte alternatif pour l'image du verso (important pour l'accessibilité)
};

// Composant réutilisable : il prend ses données via props → on peut le réutiliser
// avec d'autres images sans le réécrire.
// La déstructuration { frontSrc, frontAlt, ... } extrait directement les props par nom.
// Exemple : au lieu de faire props.frontSrc, on peut juste faire frontSrc.
export default function FlipCard({ frontSrc, frontAlt, backSrc, backAlt }: Props) {
  // État booléen : la carte est retournée ou pas.
  // Concept de "state" : une information qui peut changer au cours de la vie du composant.
  // useState(false) = valeur initiale = la carte n'est pas retournée au départ.
  // setFlipped = fonction pour mettre à jour l'état flipped.
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      // className dynamique via template string : ajoute "flipped" seulement quand flipped===true.
      // La classe "flipped" est utilisée dans le CSS pour appliquer la transformation de rotation.
      className={`flip-card ${flipped ? "flipped" : ""}`}
      // v = valeur actuelle de flipped. En faisant setFlipped(v => !v), on s'assure de toujours basculer à l'état opposé, même si plusieurs clics rapides se produisent.
      // Plus sûr que setFlipped(!flipped) si plusieurs updates s'enchaînent rapidement parce que React peut regrouper les mises à jour d'état.
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
