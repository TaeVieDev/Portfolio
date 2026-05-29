import { useState } from "react";
import SectionTitle from "../components/SectionTitle";

// Union de littéraux : 4 états pour couvrir le cycle de vie de l'envoi.
type Status = "idle" | "sending" | "sent" | "error";

// Endpoint Formspree : constante hors composant pour éviter de la recréer à chaque render.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbdbbdjy";

export default function Contact({ id = "contact" }: { id?: string }) {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // On capture la ref du form AVANT le await : React peut nettoyer e.currentTarget après une étape async.
    const form = e.currentTarget;
    setStatus("sending");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        // FormData construit le payload à partir des attributs name="" des inputs.
        body: new FormData(form),
        // Demande à Formspree de répondre en JSON au lieu d'une redirection HTML.
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("sent");
        form.reset();
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch {
      // Erreur réseau (offline, CORS, etc.) : fetch rejette la promesse.
      setStatus("error");
    }
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
                    {/* disabled pendant l'envoi : évite le double-clic.
                        Chaîne de && : si la condition est vraie, affiche le texte ; sinon React n'affiche rien. */}
                    <button
                      type="submit"
                      className="form-submit"
                      disabled={status === "sending"}
                    >
                      {status === "idle" && "Envoyer le message"}
                      {status === "sending" && "Envoi…"}
                      {status === "sent" && "Message envoyé ✓"}
                      {status === "error" && "Erreur, réessayer"}
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
