window.onload = function() {

    let panier = JSON.parse(localStorage.getItem("panier")) || [];

    // Afficher les pokemons dans le panier
    panier.forEach(pokemon => {
        let panierItem = document.createElement("li");
        panierItem.innerHTML = `
            <input type="checkbox" />
            <div class="pokemon">
                <img src="${pokemon.img}" alt="${pokemon.name}">
                <p>${pokemon.name}</p>
            </div>
            <button class="btn-delete">Supprimer</button>
        `;

        let listTotal = document.createElement("li");
        listTotal.innerHTML = ` <p><em>${pokemon.name}</em></p>
        <p><em>${pokemon.price} €</em></p>`;

        document.querySelector("#PokemonToBuy").append(panierItem);
        document.querySelector("#totalList").append(listTotal);
    });

    // Augmenter pokemon total
    let total = 0;
    panier.forEach(pokemon => {
        total += 1;
    });
    document.querySelector("#total").textContent = total;

    // Augmenter prix total
    let totalPrice = 0;
    panier.forEach(pokemon => {
        totalPrice += Number(pokemon.price);
    });
    document.querySelector("#totalPrice").textContent = totalPrice;

    // Changement du nombre de jours de livraison
    function updateDays(total) {
        let days = document.querySelector("#jours-livraison");
        if (total == 0) {
            days.textContent = "/";
        } else if (total <= 3) {
            days.textContent = "3 jours";
        } else if (total <= 7) {
            days.textContent = "10 jours";
        } else {
            days.textContent = "30 jours";
        }
    }

    updateDays(total);

    // Supprimer un pokemon du panier et diminuer total
    document.querySelectorAll(".btn-delete").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const confirmDeletion = confirm(`Êtes-vous sûr de vouloir supprimer ce pokémon?`);
            if (confirmDeletion) {
                let price = Number(panier[index].price);
                panier.splice(index, 1);

                //supprimer pokemon du total
                const totalListItems = document.querySelectorAll("#totalList li");
                totalListItems[index].remove();

                localStorage.setItem("panier", JSON.stringify(panier));
                btn.parentElement.remove();

                total -= 1;
                totalPrice -= price;

                updateDays(total);

                document.querySelector("#totalPrice").textContent = totalPrice;
                document.querySelector("#total").textContent = total;
            }
        });
    });

    // Supprimer pokemons cochés et diminuer total
    document.querySelector("#btn-supprimer").addEventListener("click", () => {
        const confirmDeletion = confirm(`Êtes-vous sûr de vouloir supprimer tous les pokémons cochés ?`);
        if (confirmDeletion) {
            document.querySelectorAll("input[type='checkbox']").forEach((checkbox, index) => {
                if (checkbox.checked) {                
                    let price = Number(panier[index].price);
                    //supprimer pokemon du total
                    const totalListItems = document.querySelectorAll("#totalList li");
                    totalListItems[index].remove();
                    panier.splice(index, 1);
                    localStorage.setItem("panier", JSON.stringify(panier));
                    checkbox.parentElement.remove();
                    total -= 1;
                    totalPrice -= price;

                    updateDays(total);
                    document.querySelector("#totalPrice").textContent = totalPrice;
                    document.querySelector("#total").textContent = total;
                }
            });
        }
    });

    //Supprimer tout les pokemons et total
    document.querySelector("#btn-suppAll").addEventListener("click", () => {
        const confirmDeletion = confirm(`Êtes-vous sûr de vouloir tout supprimer ?`);
        if (confirmDeletion) {
            panier = [];
            localStorage.setItem("panier", JSON.stringify(panier));

            document.querySelectorAll("#PokemonToBuy li").forEach(li => {
                li.remove();
            });

            document.querySelectorAll("#totalList li").forEach(li => {
                li.remove();
            });

            totalPrice = 0;
            total = 0;
            updateDays(total);

            document.querySelector("#totalPrice").textContent = totalPrice;
            document.querySelector("#total").textContent = total;
        }
    });

    //Filtrer par ordre alphabétique
    document.querySelector("#btn-filtrer").addEventListener("click", () => {
        let pokemons = document.querySelectorAll(".pokemon");
        let pokemonsArray = Array.from(pokemons);
        pokemonsArray.sort((a, b) => {
            if (a.querySelector("p").textContent > b.querySelector("p").textContent) {
                return 1;
            } else if (a.querySelector("p").textContent < b.querySelector("p").textContent) {
                return -1;
            } else {
                return 0;
            }
        });
        pokemonsArray.forEach(pokemon => {
            document.querySelector("#PokemonToBuy").append(pokemon.parentElement);
        });
    });

    //Background-color change when checked
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const pokemon = checkbox.parentElement;
            if (checkbox.checked) {
                pokemon.classList.add("checked");
            } else {
                pokemon.classList.remove("checked");
            }
        });
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