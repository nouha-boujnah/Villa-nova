// ============================================
// event.js — Affiche le détail d'un événement
// ============================================

// Récupère les paramètres dans l'URL (exemple : ?id=12345)
// URLSearchParams analyse la partie après le ? dans l'URL
const params = new URLSearchParams(window.location.search);
// .get("id") extrait la valeur du paramètre "id"
const eventId = params.get("id");

// Récupère les zones HTML de la page
const loading  = document.getElementById("loading");       // zone "chargement en cours"
const errorBox = document.getElementById("error-message"); // zone d'erreur
const detail   = document.getElementById("event-detail");  // zone du détail événement

// Identifiants de l'API OpenAgenda
const API_KEY   = "10fc54442fa745bfa28f076ae0525d71";
const AGENDA_ID = "68165804";

// Fonction principale — charge l'événement depuis l'API
// async/await = façon moderne d'écrire du code asynchrone, plus lisible que .then()
async function loadEvent() {

  // Si pas d'ID dans l'URL, on affiche une erreur directement
  if (!eventId) {
    afficherErreur("Aucun événement sélectionné.");
    return;
  }

  try {
    // Construit l'URL de l'API avec l'ID de l'événement
    const url = `https://api.openagenda.com/v2/agendas/${AGENDA_ID}/events/${eventId}?key=${API_KEY}`;
    
    // Envoie la requête HTTP GET vers l'API
    // await = attend que la réponse arrive avant de continuer
    const response = await fetch(url);

    // Si la réponse n'est pas OK (ex: erreur 404, 429, 500) on lance une erreur
    if (!response.ok) throw new Error("Réponse API invalide");

    // Convertit la réponse en objet JavaScript
    const data = await response.json();
    // data.event contient les détails de l'événement
    const event = data.event;

    // Appelle la fonction qui construit l'affichage
    afficherEvenement(event);

  } catch (err) {
    // Si une erreur survient (réseau coupé, API indisponible...)
    // on affiche un message à l'utilisateur
    console.error(err);
    afficherErreur("Impossible de charger l'événement. Réessayez plus tard.");
  }
}

// Fonction qui construit et affiche la fiche détail de l'événement
function afficherEvenement(event) {

  // Cache le message "chargement en cours"
  loading.hidden = true;

  // Si l'événement a une image on l'utilise, sinon image par défaut
  const imageUrl = event.image
    ? event.image.base + event.image.filename
    : "../images/paysage.png";

  // Récupère la date en français, ou texte par défaut si absent
  const date = event.dateRange?.fr || "Date non précisée";

  // Récupère la description courte ou longue, ou texte par défaut
  const description = event.description?.fr || event.longDescription?.fr || "Aucune description disponible.";

  // Récupère le lieu et l'adresse
  const lieu = event.location?.name || "Lieu non précisé";
  const adresse = event.location?.address || "";

  // Vérifie si une inscription est requise
  const tarif = event.registration?.length
    ? "Inscription requise"
    : "Entrée libre";

  // Construit le HTML de la fiche et l'injecte dans la page
  detail.innerHTML = `
    <img class="event-detail__image"
         src="${imageUrl}"
         alt="${event.title.fr}"
         width="800" height="450"
         loading="lazy">

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
      <!-- aria-label = texte descriptif pour les lecteurs d'écran (accessibilité) -->
      <!-- aria-hidden="true" = cache les emojis aux lecteurs d'écran -->

      <div class="event-detail__description">
        <h3>À propos</h3>
        <p>${description}</p>
      </div>
    </div>
  `;

  // Rend la fiche visible (elle était cachée pendant le chargement)
  detail.hidden = false;

  // Met le focus sur le titre après chargement pour les utilisateurs au clavier
  const titre = detail.querySelector("h2");
  if (titre) {
    titre.setAttribute("tabindex", "-1");
    titre.focus();
  }

  // Met à jour le titre de l'onglet du navigateur avec le nom de l'événement
  document.title = event.title.fr + " — Nature Animation";
}

// Fonction qui affiche un message d'erreur à l'utilisateur
function afficherErreur(message) {
  loading.hidden = true;          // Cache le chargement
  errorBox.textContent = message; // Affiche le message d'erreur
  errorBox.hidden = false;        // Rend la zone d'erreur visible
}

// Lance le chargement au démarrage de la page
loadEvent();