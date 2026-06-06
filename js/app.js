// ============================================
// app.js — Affiche la liste des événements
// ============================================

// Vérifie que le fichier JS est bien chargé
console.log("JavaScript fonctionne !");

// Attend 2 secondes puis affiche un message dans la console
// setTimeout = timer, exécute une action après un délai
setTimeout(() => {
  console.log("Bienvenue sur Île-de-France Nature Animation !");
}, 2000);

// Récupère la zone HTML où on va afficher les cartes
// getElementById cible un élément par son id dans le HTML
const container = document.getElementById("container");

// fetch() envoie une requête HTTP GET vers l'API OpenAgenda
// L'API retourne la liste des événements en format JSON
// relative[0]=current et relative[1]=upcoming = événements en cours et à venir
fetch("https://api.openagenda.com/v2/agendas/68165804/events?key=10fc54442fa745bfa28f076ae0525d71&relative%5B0%5D=current&relative%5B1%5D=upcoming")

  // Quand la réponse arrive, on la convertit en objet JavaScript
  .then(response => response.json())

  // On travaille avec les données reçues
  .then(data => {
    console.log(data.events);

    // Pour chaque événement dans le tableau, on crée une carte
    data.events.forEach(event => {

      // Si l'événement a une image on l'utilise, sinon image par défaut
      const imageUrl = event.image
        ? event.image.base + event.image.filename
        : "images/paysage.png";

      // Crée un élément HTML <article> pour la carte
      const card = document.createElement("article");
      // Ajoute la classe CSS "card" pour le style
      card.classList.add("card");
      // tabindex="0" permet de naviguer sur la carte avec la touche Tab (accessibilité)
      card.setAttribute("tabindex", "0");

      // Remplit le contenu HTML de la carte
      // Les ${} permettent d'insérer des variables dans le texte HTML
      card.innerHTML = `
        <div class="card__body">
          <h2 class="card__title">${event.title.fr}</h2>
        </div>
        <img class="card__image" 
             src="${imageUrl}" 
             alt="${event.title.fr}"
             loading="lazy">
        <div class="card__footer">
          <p class="card__date">${event.dateRange?.fr || ""}</p>
          <p class="card__location">${event.location?.name || "Lieu inconnu"}</p>
        </div>
      `;
      // loading="lazy" = l'image se charge uniquement quand elle est visible à l'écran
      // ?. = optional chaining : évite une erreur si la donnée est absente
      // || = si la valeur est vide, on affiche la valeur après le ||

      // Quand on clique sur la carte, on va vers la page détail
      // On passe l'ID de l'événement dans l'URL avec ?id=
      card.addEventListener("click", () => {
        window.location.href = `pages/event.html?id=${event.uid}`;
      });

      // Même action si l'utilisateur appuie sur la touche Entrée (accessibilité clavier)
      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter") card.click();
      });

      // Ajoute la carte dans le conteneur HTML de la page
      container.appendChild(card);
    });
  })

  // Si l'API ne répond pas ou qu'il y a une erreur réseau, on l'affiche dans la console
  .catch(error => console.error(error));