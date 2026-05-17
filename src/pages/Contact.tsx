import { useState } from "react";
import SectionTitle from "../components/SectionTitle";

// Type "union de littéraux" : Status ne peut être QUE "idle" ou "sent".
// Super utile pour modéliser une machine à états simple :
// si je tape status === "loading", TS hurle parce que ce n'est pas dans l'union.
type Status = "idle" | "sent";

export default function Contact({ id = "contact" }: { id?: string }) {
  // useState typé via <Status> : l'état est forcément du bon type.
  const [status, setStatus] = useState<Status>("idle");

  // React.FormEvent<HTMLFormElement> : type précis de l'événement de submit.
  // Préférer ça à "any" pour avoir l'auto-complétion sur e.currentTarget, e.preventDefault, etc.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Empêche le comportement par défaut (rechargement de page sur submit).
    e.preventDefault();
    // TODO: connecter à un service d'envoi (Formspree, EmailJS, backend…)
    setStatus("sent");
    // Reset des champs du formulaire. Le cast est nécessaire car currentTarget
    // est typé Element par défaut et n'a pas reset() sans cast vers HTMLFormElement.
    (e.currentTarget as HTMLFormElement).reset();
    // Après 4s on remet l'état initial. setTimeout retourne un id qu'on pourrait
    // clear, mais ici c'est jetable et pas critique.
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section id={id} className="contact_section">
      <div className="contact_container">
        <SectionTitle>Me contacter</SectionTitle>
        <p>
          Vous avez un projet, une opportunité ou simplement envie d'échanger ? N'hésitez pas à me
          contacter !
        </p>

        <div className="contact-form-wrapper">
          <div className="flex justify-center">
            <div className="w-full lg:w-2/3">
              {/* onSubmit reçoit l'event React. C'est l'équivalent de addEventListener("submit"). */}
              <form method="post" className="contact-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    {/* htmlFor en JSX (pas "for" qui est un mot-clé JS).
                        Important pour l'accessibilité : associe le label au champ. */}
                    <label htmlFor="firstname" className="form-label">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      className="form-input"
                      placeholder="Entrez votre prénom"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastname" className="form-label">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      className="form-input"
                      placeholder="Entrez votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="Entrez votre email"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="numero" className="form-label">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      id="numero"
                      name="numero"
                      className="form-input"
                      placeholder="Entrez votre numéro"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    {/* rows={5} : en JSX, les valeurs numériques se passent entre accolades.
                        rows="5" marche aussi mais c'est un string ; on préfère le number. */}
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="form-textarea"
                      placeholder="Écrivez votre message ici"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    {/* Texte du bouton dépendant de l'état : pattern très courant. */}
                    <button type="submit" className="form-submit">
                      {status === "sent" ? "Message envoyé ✓" : "Envoyer le message"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
