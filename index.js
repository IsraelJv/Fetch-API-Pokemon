const API_URL = 'https://pokeapi.co/api/v2/pokemon';

/* 
    CONSTRUI ESTA CARD PARA VER COMO PODRÍA QUEDAR

<div class="row gy-3 my-3">
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <div class="card" >
                        <img src="./perro-javascript.png" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 id="name-pokemon" class="card-title text-center">Nombre de pokemon</h5>
                          <h6 id="id-pokemon" class="card-subtitle mb-2 text-body-secondary text-center">Id pokemon</h6>
                          <p id="weight-pokemon" class="card-text text-center">Peso</p>
                        </div>
                    </div>
                </div>
            </div>
*/

const cardPokemon = ({urlImg, altImg, namePokemon, idPokemon, weightPokemon}) => {
    // Creación de elementos
    const row = document.createElement('div');
    const col = document.createElement('div');
    const card = document.createElement('div');
    const img = document.createElement('img');
    const cardBody = document.createElement('div');
    const title = document.createElement('h5');
    const subtitle = document.createElement('h6');
    const text = document.createElement('p');

    // Clases
    row.className = 'row gy-3 my-3';
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
    row.appendChild(col);

    // Se añade al documento
    document.getElementById('pokemon-container').appendChild(row);
}

document.getElementById('btn-show-pokemons').addEventListener('click', async () => {
    const pokemons = await fetchPokemon(API_URL);
    const arrayUrlsPokemonsPromise = pokemons.results.map(pokemon => fetchPokemon(pokemon.url));
    const arrayUrlsPokemons = await Promise.all(arrayUrlsPokemonsPromise);

    const dataPokemons = arrayUrlsPokemons.map(infoPokemon => {
        return infoPokemon = {
            namePokemon: infoPokemon.name,
            idPokemon: infoPokemon.id,
            weightPokemon: infoPokemon.weight,
            urlImg: infoPokemon.sprites.back_default,
            altImg: infoPokemon.name + " image"
        }
    });
    
    dataPokemons.forEach(pokemon => cardPokemon(pokemon));
    saveDataLocalStorage(dataPokemons);
})

const fetchPokemon = async ( rute ) => {
    try {
        const data = await fetch(rute);
        const parsedData = await data.json();
        return parsedData;
    } catch (err) {
        console.error(err);
    }
}

const saveDataLocalStorage = ( data ) => {
    console.log(data); // MENSAJE EN CONSOLA CON DATOS DEL ARREGLO.
    console.log(JSON.stringify(data)); // MENSAJE EN CONSOLA CON ARREGLO VACÍO.
    localStorage.setItem("list-pokemons", JSON.stringify(data));
}

const getDataLocalStorage = () => {
    const dataPokemons = JSON.parse(localStorage.getItem("list-pokemons"));
    console.log(dataPokemons, dataPokemons.length);
    if (dataPokemons){
        dataPokemons.forEach(pokemon => cardPokemon(pokemon));
    }else {
        console.log("No hay datos en el local storage");
    }
}

getDataLocalStorage()
