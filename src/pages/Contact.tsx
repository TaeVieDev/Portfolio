import { useState } from "react";

type Status = "idle" | "sent";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: connecter à un service d'envoi (Formspree, EmailJS, backend…)
    setStatus("sent");
    (e.currentTarget as HTMLFormElement).reset();
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section className="contact_section">
      <div className="contact_container">
        <div className="section_title">
          <h2>
            <strong>Me contacter</strong>
          </h2>
          <p>
            Vous avez un projet, une opportunité ou simplement envie d'échanger ? N'hésitez pas à
            me contacter !
          </p>
        </div>

        <div className="contact-form-wrapper">
          <div className="flex justify-center">
            <div className="w-full lg:w-2/3">
              <form method="post" className="contact-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
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
