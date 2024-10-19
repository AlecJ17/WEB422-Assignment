/*********************************************************************************
 *	WEB422 – Assignment 2
 *	I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *	No part of this assignment has been copied manually or electronically from any other source
 *	(including web sites) or distributed to other students.
 *
 *	Name: Alec Josef Serrano
 *	Student ID: 133592238
 *	Date: October 14, 2024
 *
 ********************************************************************************/
document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = `${window.location.origin}/api/movies`;
    let currentPage = 1;
    const perPage = 10;

    // DOM Elements
    const tableBody = document.querySelector('#moviesTableBody');
    const searchForm = document.querySelector('#searchForm');
    const titleInput = document.querySelector('#title');
    const clearForm = document.querySelector('#clearForm');
    const prevPageButton = document.querySelector('#previous-page');
    const nextPageButton = document.querySelector('#next-page');
    const currentPageDisplay = document.querySelector('#current-page');
    const pagination = document.querySelector('.pagination');
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('container', 'mt-4');
    document.body.appendChild(cardContainer);

    // Load movies from API
    function loadMovieData(title = null) {
        let url = `${baseUrl}?page=${currentPage}&perPage=${perPage}`;
        if (title) {
            url += `&title=${encodeURIComponent(title)}`;
            currentPage = 1;
            pagination.classList.add('d-none');
        } else {
            pagination.classList.remove('d-none');
        }

        console.log(`Fetching data from: ${url}`); // Log the URL being fetched

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(movies => {
                console.log('Movies fetched:', movies); // Log the fetched movies
                displayMovies(movies);
                updatePagination();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Display movies in the table
    function displayMovies(movies) {
        tableBody.innerHTML = movies.map(movie => `
            <tr data-id="${movie._id}">
                <td>${movie.year}</td>
                <td>${movie.title}</td>
                <td>${movie.plot || 'N/A'}</td>
                <td>${movie.rated || 'N/A'}</td>
                <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
            </tr>
        `).join('');

        // Add click events to rows
        document.querySelectorAll('#moviesTableBody tr').forEach(row => {
            row.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                fetch(`${baseUrl}/${id}`)
                    .then(response => response.json())
                    .then(movie => showCard(movie))
                    .catch(error => console.error('Error loading movie details:', error));
            });
        });
    }

    // Update pagination display
    function updatePagination() {
        currentPageDisplay.textContent = currentPage;
    }

    // Show movie details in a modal
    function showCard(movie) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        // Set the modal title
        modalTitle.textContent = movie.title;

        // Build the movie card content dynamically, checking for poster
        modalBody.innerHTML = `
        <div class="card">
            ${movie.poster ? `<img src="${movie.poster}" class="card-img-top" alt="Movie Poster">` : ''}
            <div class="card-body">
                <p class="card-text"><strong>Directed By:</strong> ${movie.directors.join(', ') || 'N/A'}</p>
                <p class="card-text">${movie.fullplot || 'N/A'}</p>
                <p class="card-text"><strong>Cast:</strong> ${movie.cast.join(', ') || 'N/A'}</p>
                <p class="card-text"><strong>Awards:</strong> ${movie.awards.text || 'N/A'}</p>
                <p class="card-text"><strong>IMDB Rating:</strong> ${movie.imdb.rating || 'N/A'} (${movie.imdb.votes || 0} votes)</p>
            </div>
        </div>
    `;

        // Initialize and show the Bootstrap modal
        const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
            backdrop: 'static',
            keyboard: false,
            focus: true
        });
        detailsModal.show();
    }

    // Event Listeners
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadMovieData(titleInput.value);
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        loadMovieData(titleInput.value);
    });

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        loadMovieData(titleInput.value);
    });

    clearForm.addEventListener('click', () => {
        titleInput.value = '';
        loadMovieData();
    });

    // Initially load movies
    loadMovieData();
});