window.onload = function() {

    let panier = JSON.parse(localStorage.getItem("panier")) || [];
    let details = JSON.parse(localStorage.getItem("details"));
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${details.name}`)
    .then((response) => response.json())
    .then((data) => {
        //afficher les details du pokémon
        let detailsDiv = document.createElement("div");
        detailsDiv.className = "details";
        detailsDiv.innerHTML = `
            <h2>${data.name}</h2>
            <p><b>Prix : ${details.price}</b></p>
            <p>Type(s) : ${data.types.map((type) => type.type.name).join(", ")}</p>
            <p>Taille : ${data.height}</p>
            <p>Poids : ${data.weight}</p>
            <p>Expérience de base : ${data.base_experience}</p>
            <p>Stats : ${data.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(", ")}</p>
            <p>Abilités : ${data.abilities.map((ability) => ability.ability.name).join(", ")}</p>
            <button class="AjouterPanier">Ajouter au panier</button>
        `
        document.querySelector("#details-container").append(detailsDiv);

        //ajout au panier
        let btnPanier = detailsDiv.querySelector(".AjouterPanier");

        btnPanier.addEventListener("click", () => {
            let pokemonData = {
                name: data.name,
                img: details.img,
                price: details.price
            };
            panier.push(pokemonData);
            localStorage.setItem("panier", JSON.stringify(panier));
        });
    });

    //images
    fetch(`https://pokeapi.co/api/v2/pokemon/${details.name}`)
    .then((response) => response.json())
    .then((data) => {
        //afficher images du pokemon
        let pokeImg1 = document.createElement("img");
        pokeImg1.src = data.sprites.front_default;

        let pokeImg2 = document.createElement("img");
        pokeImg2.src = data.sprites.back_default;

        //animation bounce img
        pokeImg1.addEventListener("click", () => {
            pokeImg1.classList.add("bounce");
            pokeImg1.addEventListener("animationend", () => pokeImg1.classList.remove("bounce"));
        });

        pokeImg2.addEventListener("click", () => {
            pokeImg2.classList.add("bounce");
            pokeImg2.addEventListener("animationend", () => pokeImg2.classList.remove("bounce"));
        });

        document.querySelector("#img-produit").append(pokeImg2);
        document.querySelector("#img-produit").append(pokeImg1);
    });
    
    //light/dark mode
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
}