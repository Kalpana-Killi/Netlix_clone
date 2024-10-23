const apiKey = '23942db0401c5da45298aaa6ea9cfb85'; // Your API key
const apiEndpoint = 'https://api.themoviedb.org/3';
const imageBaseURL = 'https://image.tmdb.org/t/p/w500'; // TMDB base URL for images

const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`
};

// Initialize function to fetch all categories
function init() {
    fetchAndBuildAllSections();
}

// Function to fetch and build all sections
function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const categories = data.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.forEach(category => {
                    fetchAndBuildMovieSection(apiPaths.fetchMoviesList(category.id), category);
                });
            }
            console.table(data.genres);
        })
        .catch(error => {
            console.error('Error fetching genres:', error);
        });
}

// Function to fetch and build movie section
function fetchAndBuildMovieSection(fetchUrl, category) {
    console.log(fetchUrl, category);
    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Movies for category ${category.name}:`, data.results);
            const movies = data.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies, category.name);
            }
        })
        .catch(error => {
            console.error(`Error fetching movies for category ${category.name}:`, error);
        });
}

function buildMoviesSection(list, categoryName) {
    console.log(list, categoryName);

    const movieCont = document.querySelector('.movies-cont');
    if (movieCont) {
        const moviesListHTML = list.map(item => {
            return `<img class="movie-item" src="${imageBaseURL}${item.poster_path}" alt="${item.title}">`;
        }).join('');
        
        const moviesSectionHTML = `
            <div class="movies-section">
                <h2 class="movie-section-heading">${categoryName}</h2>
                <div class="movies-row">
                    ${moviesListHTML}
                </div>
            </div>
        `;
        
        movieCont.innerHTML += moviesSectionHTML;
    }
}

// Event listener for window load
window.addEventListener('load', function () {
    init();
});
