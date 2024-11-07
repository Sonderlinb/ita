// Asynkron funktion til at hente albumdata fra 'albums.json'
async function fetchAlbums() {
    try {
        // Henter data fra 'albums.json' og venter, indtil anmodningen er færdig
        const response = await fetch('albums.json');
        
        // Tjekker om svaret er OK; hvis ikke, vises der en fejl
        if (!response.ok) {
            throw new Error(`HTTP-fejl! status: ${response.status}`);
        }
        
        // Venter på svaret fra json
        const albumsData = await response.json();
        
        // Logger albumdata for fejlfinding
        console.log(albumsData); 
        
        // Returnerer data, så de kan bruges andre steder i appen
        return albumsData;
    } catch (error) {
        // Fanger eventuelle fejl (som netværksproblemer) og logger en fejlbesked i konsollen
        console.error('Kunne ikke hente albums:', error);
    }
}

// Klasse til at repræsentere et Album med egenskaber og en metode til at gengive dets detaljer
class Album {
    // Konstruktøren tager parametre for hvert album og tildeler dem til instansen
    constructor(id, albumName, artistName, artistWebsite, productionYear, genre, trackList) {
        this.id = id;
        this.albumName = albumName;
        this.artistName = artistName;
        this.artistWebsite = artistWebsite;
        this.productionYear = productionYear;
        this.genre = genre;
        this.trackList = trackList;
    }

    // Metode til at gengive albummet som et DOM-element
    render() {
        // Opretter et div-element til at indeholde albumdetaljer
        const albumDiv = document.createElement('div');
        
        // Tildeler en CSS-klasse for styling
        albumDiv.className = 'album';

        // Fylder div'en med albumdetaljer ved hjælp af en HTML-skabelon
        albumDiv.innerHTML = `
            <h2>${this.albumName} (${this.productionYear})</h2>
            <h3>Af: ${this.artistName}</h3>
            <a href="${this.artistWebsite}" target="_blank">Kunstnerens hjemmeside</a>
            <h4>Genre: ${this.genre}</h4>
            <button class="toggle-tracks">Vis numre</button>
            <div class="tracks" style="display: none;">
                ${this.trackList.map(track => `
                    <p>${track.trackNumber}. ${track.trackTitle} (${Math.floor(track.trackTimeInSeconds / 60)}:${(track.trackTimeInSeconds % 60).toString().padStart(2, '0')})</p>
                `).join('')}
            </div>
        `;

        // Vælger toggle-knappen og tracks-div for at styre visningen af tracklisten
        const toggleButton = albumDiv.querySelector('.toggle-tracks');
        const tracksDiv = albumDiv.querySelector('.tracks');

        // Tilføjer en event listener for at skifte synligheden af tracklisten
        toggleButton.addEventListener('click', () => {
            if (tracksDiv.style.display === "none") {
                // Viser tracklisten og opdaterer knapteksten
                tracksDiv.style.display = "block";
                toggleButton.textContent = "Skjul numre";
            } else {
                // Skjuler tracklisten og opdaterer knapteksten
                tracksDiv.style.display = "none";
                toggleButton.textContent = "Vis numre";
            }
        });

        // Returnerer albumDiv-elementet, så det kan tilføjes til DOM'en
        return albumDiv;
    }
}

// Initialiseringsfunktion til at hente data og gengive albums
async function init() {
    // Henter albumdata ved hjælp af fetchAlbums og venter på resultatet
    const albumsData = await fetchAlbums();

    // Vælger containeren i HTML'en, hvor albummerne vil blive vist
    const albumsContainer = document.getElementById('albums');

    // Itererer over hvert album i de hentede data
    albumsData.forEach(album => {
        // Opretter en ny Album-instans med albummets detaljer
        const albumObject = new Album(
            album.id,
            album.albumName,
            album.artistName,
            album.artistWebsite,
            album.productionYear,
            album.genre,
            album.trackList
        );
        
        // Gengiver albummet og tilføjer det til albumsContainer
        albumsContainer.appendChild(albumObject.render());
    });
}

// Kalder init for at starte applikationen, så snart scriptet kører
init();
