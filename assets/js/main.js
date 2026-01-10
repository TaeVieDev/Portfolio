/* Main JavaScript */

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
});

function initDropdown() {
  const dropdowns = document.querySelectorAll(".dropdown-nav");

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".dropdown-trigger");

    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();

        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            other.classList.remove("active");
          }
        });

        dropdown.classList.toggle("active");
      });
    }
  });

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
