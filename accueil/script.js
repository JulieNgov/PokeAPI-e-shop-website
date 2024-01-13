const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchButton");
// Prix des pokémons par type
const typePrices = {
    grass: 10,
    fire: 15,
    water: 12,
    bug: 8,
    normal: 5,
    poison: 7,
    electric: 14,
    ground: 9,
    fairy: 13,
    fighting: 11,
    psychic: 16,
    rock: 6,
    ghost: 17,
    ice: 18,
    dragon: 19,
    steel: 20,
    flying: 21,
    dark: 22
  };

fetch("https://pokeapi.co/api/v2/pokemon/?limit=50")
    .then((response) => response.json())
    .then((data) => {
        let panier = JSON.parse(localStorage.getItem("panier")) || [];
        data.results.forEach((pokemon) => {
            fetch(pokemon.url)
                .then((response) => response.json())
                .then((pokemonDetails) => {
                    let price = typePrices[pokemonDetails.types[0].type.name];
                    //afficher les pokemon dans accueil
                    let urlParts = pokemon.url.split('/');
                    let id = urlParts[urlParts.length - 2];
                    let card = document.createElement("div");
                    card.className = `card ${pokemonDetails.types.map((type) => type.type.name).join(", ")}`;
                    card.innerHTML = `
                    <label class="labelexpanded">
                        <input type="checkbox" data-id="${id}" data-name="${pokemon.name}" data-price="${price}"/>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${pokemon.name}">
                        <h2>${pokemon.name}</h2>
                        <p>Prix: ${price} €</p>
                        <a href="../produit/produit.html">
                            <button>Détails</button>
                        </a>
                        <button class="AjouterPanier">Ajouter au panier</button>
                    </label>
                    `;

                    document.querySelector("#card-container").append(card);

                    //ajout au panier
                    let btnPanier = card.querySelector(".AjouterPanier");
                    btnPanier.addEventListener("click", () => {
                        let pokemonData = {
                            name: pokemon.name,
                            price: price,
                            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                        };
                        panier.push(pokemonData);
                        localStorage.setItem("panier", JSON.stringify(panier));
                    });

                    //stocker les details pour la page produit
                    let btnDetails = card.querySelector("a button");

                    btnDetails.addEventListener("click", (e) => {
                        let details = {
                            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                            name: pokemon.name,
                            price: price,
                            types: pokemonDetails.types.map((type) => type.type.name).join(", "),
                            stats: pokemonDetails.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(", ")
                        };
                        localStorage.setItem("details", JSON.stringify(details));
                    });

                    //Active le css checked quand c'est checké
                    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                        checkbox.addEventListener("change", () => {
                            const task = checkbox.parentElement;
                            if (checkbox.checked) {
                                task.classList.add("checked");
                            } else {
                                task.classList.remove("checked");
                            }
                        });
                    });
                });
        });
        // Ajouter au panier les checkés (en dehors du 2eme foreach pour éviter les doublons)
        document.querySelector("#AjoutPanier").addEventListener("click", () => {
            let panier = JSON.parse(localStorage.getItem("panier")) || [];
            document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                if (checkbox.checked) {
                    let id = checkbox.dataset.id;
                    let name = checkbox.dataset.name;
                    let price = checkbox.dataset.price;
                    let pokemonData = {
                        name: name,
                        price: price,
                        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                    };
                    panier.push(pokemonData);
                    localStorage.setItem("panier", JSON.stringify(panier));
                }
            });
        });
    });

// Filtrer les pokémons avec select
document.querySelector("#type-select").addEventListener("change", (event) => {
    let selectedType = event.target.value;

    document.querySelectorAll(".card").forEach((card) => {
        if (selectedType === "all" || card.classList.contains(selectedType)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});


//input search (nom et types)
function search() {
    let searchValue = searchInput.value.toLowerCase();
    let cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        let cardTypes = Array.from(card.classList);
        cardTypes.shift();
        if (card.textContent.toLowerCase().includes(searchValue) || cardTypes.some(type => type.includes(searchValue))) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

searchBtn.addEventListener("click", search);

// Light/Dark mode
const themeToggle = document.querySelector("#theme-toggle");
const currentTheme = localStorage.getItem("theme");
const pageTheme = document.body;

if (currentTheme == "light") {
  pageTheme.classList.add("light-theme");
  themeToggle.innerHTML=`<i class="fa-solid fa-toggle-off"></i>`;
} else {
  themeToggle.innerHTML = `<i class="fa-solid fa-toggle-on"></i>`;
}

function themeMode() {
  pageTheme.classList.toggle("light-theme");

  let theme = "dark";
  if (pageTheme.classList.contains("light-theme")) {
    theme = "light";
    themeToggle.innerHTML = `<i class="fa-solid fa-toggle-off"></i>`;
  } else {
    themeToggle.innerHTML = `<i class="fa-solid fa-toggle-on"></i>`;
  }
  localStorage.setItem("theme", theme);
}

themeToggle.addEventListener("click", themeMode);