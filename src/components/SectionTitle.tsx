import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// Titre de section réutilisable.
// Le responsive est géré par les utilitaires Tailwind (xs / md / mid) :
// - mobile par défaut          → text-[1.5rem]
// - >= 480px (xs:)             → text-[1.8rem]
// - >= 768px (md:)             → text-[2rem]
// - >= 992px (mid:)            → text-[2.5rem]
// Les breakpoints xs et mid sont définis dans index.css (@theme).
export default function SectionTitle({ children }: Props) {
  // Le tracking-[1px] et word-spacing:1px sont utilisés pour espacer les lettres et les mots du titre.
  return (
    <h2 className="mb-8 tracking-[1px] [word-spacing:1px] text-text-primary text-[1.5rem] xs:text-[1.8rem] md:text-[2rem] mid:text-[2.5rem]">
      <strong>{children}</strong>
    </h2>
  );
}
