const API_URL = 'https://pokeapi.co/api/v2/';

// Quita las cards de consultas previas.
const reinciarCards = () => {
    const contenedorCards = document.getElementById('row-id');
    while (contenedorCards.firstChild) 
        contenedorCards.firstChild.remove();
    
}


// Crea una card con los datos proporcionados
const cardPokemon = ({urlImg, altImg, namePokemon, idPokemon, weightPokemon}) => {
    // Creación de elementos
    const col = document.createElement('div');
    const card = document.createElement('div');
    const img = document.createElement('img');
    const cardBody = document.createElement('div');
    const title = document.createElement('h5');
    const subtitle = document.createElement('h6');
    const text = document.createElement('p');

    // Clases
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    card.className = 'card';
    img.className = 'card-img-top';
    cardBody.className = 'card-body';
    title.className = 'card-title text-center';
    subtitle.className = 'card-subtitle mb-2 text-body-secondary text-center';
    text.className = 'card-text text-center';

    // Identificadores
    title.id = 'name-pokemon';
    subtitle.id = 'id-pokemon';
    text.id = 'weight-pokemon';

    // Asignar valores
    img.src = urlImg;
    img.alt = altImg;
    title.textContent = namePokemon;
    subtitle.textContent = "ID " + idPokemon;
    text.textContent = "Pesa " + weightPokemon;

    // Estructurar los elementos
    cardBody.appendChild(title);
    cardBody.appendChild(subtitle);
    cardBody.appendChild(text);
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);

    // Se añade al documento
    document.getElementById('row-id').appendChild(col);
}

// Obtiene todos los datos de los pokemons
const getDataAPI = async ( complementURL = '' ) => {
    try {
        // Se manda a llamar los datos de la API
        const pokemons = await fetchPokemon(`${API_URL}${complementURL}`);
        // Se obtiene un arreglo de promesas para cada URL de Pokémon
        const arrayPokemonsPromise = pokemons.results.map(pokemon => fetchPokemon(pokemon.url));
        // Se espera a que todas las promesas se resuelvan
        const arrayPokemons = await Promise.all(arrayPokemonsPromise);
        // Devuelve el arreglo de Pokémon
        return arrayPokemons;
    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener datos de la API:", error);
    }
}

// Filtra la información que vamos a estar utilizando
const filterInfoPokemon = ( infoPokemon ) => {
    return  {
        namePokemon: infoPokemon.name,
        idPokemon: infoPokemon.id,
        weightPokemon: infoPokemon.weight,
        urlImg: infoPokemon.sprites.back_default,
        altImg: infoPokemon.name + " image"
    }
}

// Consulta a la API
const fetchPokemon = async ( rute ) => {
    try {
        const data = await fetch(rute);
        const parsedData = await data.json();
        return parsedData;
    } catch (err) {
        console.error(err);
    }
}

// Botón que muestra todos los pokemons
document.getElementById('btn-show-pokemons').addEventListener('click', async () => {
    reinciarCards()
    const arrayPokemons = await getDataAPI('pokemon');
    // Se construye un array con los datos que necesitamos
    const dataPokemons = arrayPokemons.map(infoPokemon => {
        return filterInfoPokemon(infoPokemon);
    });
    // Se crean las cards en el front
    dataPokemons.forEach(pokemon => cardPokemon(pokemon));
})

// Botón que obtiene un solo pokemon
document.getElementById('get-btn').addEventListener('click', async () =>  {
    reinciarCards()
    const text = document.getElementById('poke-name').value.toLowerCase();
    const pokemonFull = await fetchPokemon(`${API_URL}pokemon/${text}`);
    const pokemon = filterInfoPokemon(pokemonFull);
    cardPokemon(pokemon);
    saveIdLocalStorage(pokemon.idPokemon);
})

// Botón que obtiene el pokemon previo
document.getElementById('previous-btn').addEventListener('click', async () => {
    const idPokemon = parseInt(localStorage.getItem("id-pokemon"));
    getPokemon(idPokemon - 1);
})

// Botón que obtiene el pokemon siguiente
document.getElementById('next-btn').addEventListener('click', async () => {
    const idPokemon = parseInt(localStorage.getItem("id-pokemon"));
    getPokemon(idPokemon + 1);
})

const getPokemon = async ( idPokemon) => {
    try {
        reinciarCards();
        const pokemonFull = await fetchPokemon(`${API_URL}pokemon/${idPokemon}`);
        const pokemon = filterInfoPokemon(pokemonFull);
        cardPokemon(pokemon);
        saveIdLocalStorage(idPokemon);
    } catch (error) {
        console.log("No se encontró ningún pokemon.");
    }
}

// Guarda el id del pokemon en el localStorage
const saveIdLocalStorage = ( idPokemon ) => {
    localStorage.setItem("id-pokemon", idPokemon);
}

// Obtiene el id guardado en el localStore y busca el pokemon.
const getDataLocalStorage = async () => {
    const idPokemon = localStorage.getItem("id-pokemon");
    if (idPokemon){
        getPokemon(idPokemon);
    }else {
        console.log("No hay datos en el local storage");
    }
}



getDataLocalStorage();
