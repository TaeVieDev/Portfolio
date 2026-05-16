// Composant "présentationnel".
export default function Footer() {
  return (
    <footer>
      <div className="footer">
        <div className="footer-social-links">
          {/* target="_blank" + rel="noopener noreferrer" est OBLIGATOIRE pour la sécurité :
              sans noopener, la page ouverte pourrait accéder à window.opener et rediriger
              celle d'origine. */}
          <a href="https://github.com/thomas-montout" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-square-github" />
          </a>
          <a
            href="https://www.linkedin.com/in/thomas-montout"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-square-linkedin" />
          </a>
          <a href="mailto:montout-thomas@hotmail.fr">
            <i className="fa-solid fa-envelope" />
          </a>
        </div>
        <p>© 2026 Thomas. All rights reserved.</p>
      </div>
    </footer>
  );
}
