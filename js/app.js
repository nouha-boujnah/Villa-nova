console.log("JavaScript fonctionne !");
// Timer — message de bienvenue après 2 secondes
setTimeout(() => {
  console.log("Bienvenue sur Île-de-France Nature Animation !");
}, 2000);

const container = document.getElementById("container");

fetch("https://api.openagenda.com/v2/agendas/68165804/events?key=10fc54442fa745bfa28f076ae0525d71&relative%5B0%5D=current&relative%5B1%5D=upcoming")
  .then(response => response.json())
  .then(data => {
    console.log(data.events);

    data.events.forEach(event => {
      const imageUrl = event.image
        ? event.image.base + event.image.filename
        : "images/paysage.png";

      const card = document.createElement("article");
      card.classList.add("card");
      card.setAttribute("tabindex", "0");

      card.innerHTML = `
  <div class="card__body">
    <h2 class="card__title">${event.title.fr}</h2>
  </div>
  <img class="card__image" src="${imageUrl}" alt="${event.title.fr}" loading="lazy">
  <div class="card__footer">
    <p class="card__date">${event.dateRange?.fr || ""}</p>
    <p class="card__location">${event.location?.name || "Lieu inconnu"}</p>
  </div>
`;

      card.addEventListener("click", () => {
        window.location.href = `pages/event.html?id=${event.uid}`;
      });

      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter") card.click();
      });

      container.appendChild(card);
    });
  })
  .catch(error => console.error(error));