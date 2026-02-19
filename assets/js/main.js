// Pages temporairement masquées — redirection si accès direct
const hiddenPages = ["projets-E6.html", "veille-technologique.html"];
const currentPage = window.location.pathname.split("/").pop();
if (hiddenPages.includes(currentPage)) {
  // Redirige vers l'accueil (fonctionne depuis /pages/)
  window.location.replace("../index.html");
}

// Initialisation au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  // Toujours commencer en haut de la page au chargement
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
    window.scrollTo(0, 0);
  }

  initParticles();
  initDropdown();
  initFlipCard();
  initMobileMenu();
  initContactForm();
});

function initDropdown() {
  const dropdowns = document.querySelectorAll(".dropdown-nav");

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".dropdown-trigger");

    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Empêche la propagation vers le document

        // Ferme tous les autres dropdowns
        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            other.classList.remove("active");
          }
        });

        // Toggle le dropdown actuel
        dropdown.classList.toggle("active");
      });
    }
  });

  // Ferme les dropdowns en cliquant à l'extérieur
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown-nav")) {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });
}

function initParticles() {
  const squares = document.querySelectorAll(".square");

  squares.forEach((square) => {
    const startY = Math.random() * 100;
    square.style.bottom = startY + "vh";

    square.addEventListener("animationiteration", () => {
      const randomX = (Math.random() - 0.5) * 100;
      square.style.transform = `translateX(${randomX}px)`;
    });
  });
}

function initFlipCard() {
  const flipCard = document.getElementById("heroCard");

  if (flipCard) {
    flipCard.addEventListener("click", () => {
      flipCard.classList.toggle("flipped");
    });
  }
}

function initMobileMenu() {
  const menuBurger = document.querySelector(".menu-burger");
  const nav = document.querySelector(".links");

  if (menuBurger && nav) {
    menuBurger.addEventListener("click", () => {
      nav.classList.toggle("open");

      // Change l'icône du burger
      const icon = menuBurger.querySelector("i");
      if (nav.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });

    // Ferme le menu UNIQUEMENT sur les liens qui ne sont pas des dropdown triggers
    const navLinks = nav.querySelectorAll("a:not(.dropdown-trigger)");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        const icon = menuBurger.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      });
    });
  }
}

function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: Connecter à un service d'envoi (Formspree, EmailJS, backend...)
      alert("Merci pour votre message ! (Fonctionnalité en cours de développement)");
      form.reset();
    });
  }
}
