
// Récupère l'ID de l'événement depuis l'URL (?id=XXXX)
const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const loading   = document.getElementById("loading");
const errorBox  = document.getElementById("error-message");
const detail    = document.getElementById("event-detail");

// Clé API et agenda (mêmes que dans app.js)
const API_KEY   = "10fc54442fa745bfa28f076ae0525d71";
const AGENDA_ID = "68165804";

async function loadEvent() {
  // Si pas d'ID dans l'URL → erreur directe
  if (!eventId) {
    afficherErreur("Aucun événement sélectionné.");
    return;
  }

  try {
    const url = `https://api.openagenda.com/v2/agendas/${AGENDA_ID}/events/${eventId}?key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Réponse API invalide");

    const data = await response.json();
    const event = data.event;

    afficherEvenement(event);

  } catch (err) {
    console.error(err);
    afficherErreur("Impossible de charger l'événement. Réessayez plus tard.");
  }
}

function afficherEvenement(event) {
  // Cache le loader
  loading.hidden = true;

  // Construit l'image
  const imageUrl = event.image
    ? event.image.base + event.image.filename
    : "../images/paysage.png";

  // Construit les dates
  const date = event.dateRange?.fr || "Date non précisée";

  // Construit la description
  const description = event.description?.fr || event.longDescription?.fr || "Aucune description disponible.";

  // Construit le lieu
  const lieu = event.location?.name || "Lieu non précisé";
  const adresse = event.location?.address || "";

  // Construit les tarifs
  const tarif = event.registration?.length
    ? "Inscription requise"
    : "Entrée libre";

  // Injecte le HTML dans l'article
  detail.innerHTML = `
    <img class="event-detail__image"
         src="${imageUrl}"
         alt="${event.title.fr}"
         width="800" height="450">

    <div class="event-detail__content">
      <h2 class="event-detail__title">${event.title.fr}</h2>

      <ul class="event-detail__meta" aria-label="Informations pratiques">
        <li>
          <span aria-hidden="true">📅</span>
          <span>${date}</span>
        </li>
        <li>
          <span aria-hidden="true">📍</span>
          <span>${lieu}${adresse ? " — " + adresse : ""}</span>
        </li>
        <li>
          <span aria-hidden="true">🎟️</span>
          <span>${tarif}</span>
        </li>
      </ul>

      <div class="event-detail__description">
        <h3>À propos</h3>
        <p>${description}</p>
      </div>
    </div>
  `;

  // Rend l'article visible
  detail.hidden = false;

  // Accessibilité : met le focus sur le titre après chargement
  const titre = detail.querySelector("h2");
  if (titre) {
    titre.setAttribute("tabindex", "-1");
    titre.focus();
  }

  // Met à jour le titre de la page
  document.title = event.title.fr + " — Nature Animation";
}

function afficherErreur(message) {
  loading.hidden = true;
  errorBox.textContent = message;
  errorBox.hidden = false;
}

// Lance le chargement
loadEvent();