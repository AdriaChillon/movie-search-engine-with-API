document.addEventListener("DOMContentLoaded", function () {
  var cardsContainer = document.getElementById("movies");
  var filmButton = document.getElementById("filmButton");
  var cardMovie = document.getElementsByClassName("col-md-4")[0];
  var inputElement = document.querySelector('#filmSearch');
  var suggestionsContainer = document.querySelector('#suggestions');
  var loadingIndicator = document.querySelector('.loading');

  filmButton.addEventListener("click", function () {
    var movieName = document.getElementById("filmSearch").value;
    showLoading(true);
    const settings = {
      async: true,
      crossDomain: true,
      url: "https://api.themoviedb.org/3/search/movie?query=" + encodeURIComponent(movieName) + "&include_adult=false&language=es&page=1",
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjMyNDc2Y2IyMzU2Yjk0NmMzZTFhODMxMTUzN2QxNiIsInN1YiI6IjY2MWQ1YTUxZWMwYzU4MDE3Yzc0ZDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gW2AlEPDbWxRQq-95o4hNQdj5sxc7RASvW8p5LJjPvo'
      }
    };

    $.ajax(settings).done(function (response) {
      showLoading(false);
      suggestionsContainer.style.display = 'none';
      while (cardsContainer.firstChild) {
        cardsContainer.removeChild(cardsContainer.firstChild);
      }

      response.results.forEach(function (movie) {
        var cardTemplate = cardMovie.cloneNode(true);
        cardTemplate.querySelector('.card-title').innerHTML = movie.title;
        cardTemplate.querySelector('.card-img-top').src = "https://image.tmdb.org/t/p/original" + movie.poster_path;
        var movieId = movie.id;

        // Coordinar las llamadas API y actualizaciones del DOM
        Promise.all([
          new Promise(resolve => genreApiRequest(movieId, (genres, linkIMDB) => {
            cardTemplate.querySelectorAll('.text-muted')[0].innerHTML = "<i class='bi bi-film mx-2'> </i>" + genres;
            cardTemplate.querySelector('.card-footer .text-white').href = "https://www.imdb.com/title/" + linkIMDB;
            resolve();
          })),
          new Promise(resolve => actorsApiRequest(movieId, (actors) => {
            cardTemplate.querySelectorAll('.text-muted')[2].innerHTML = "<i class='bi bi-people mx-2'></i>" + actors;
            resolve();
          }))
        ]).then(() => {
          var date = movie.release_date.split('-');
          var formatDate = date[2] + '-' + date[1] + '-' + date[0];
          cardTemplate.querySelectorAll('.text-muted')[1].innerHTML = "<i class='bi bi-calendar3 mx-2'></i> " + formatDate;
          cardsContainer.appendChild(cardTemplate); // Añadir tarjeta solo después de actualizar toda la info
        });
      });
    });
  });

  // Función para manejar el evento input del campo de búsqueda.
  inputElement.addEventListener("input", function () {
    var query = this.value;
    if (query.length > 2) { // Evitar llamadas API innecesarias con cadenas demasiado cortas.
      searchMovies(query);
    } else {
      suggestionsContainer.style.display = 'none'; // Ocultar sugerencias si la consulta es demasiado corta.
    }
  });

  function showLoading(display) {
    loadingIndicator.style.display = display ? 'block' : 'none';
  }

  function genreApiRequest(id, callback) {
    const options = {
      url: "https://api.themoviedb.org/3/movie/" + id + "?language=en-US",
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjMyNDc2Y2IyMzU2Yjk0NmMzZTFhODMxMTUzN2QxNiIsInN1YiI6IjY2MWQ1YTUxZWMwYzU4MDE3Yzc0ZDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gW2AlEPDbWxRQq-95o4hNQdj5sxc7RASvW8p5LJjPvo'
      }
    };
    $.ajax(options).done(function (response) {
      var stringGenres = response.genres.map(genre => genre.name).join(", ");
      var linkIMDB = response.imdb_id;
      callback(stringGenres, linkIMDB);
    });
  }

  function actorsApiRequest(id, callback) {
    const options = {
      url: 'https://api.themoviedb.org/3/movie/' + id + '/credits?language=en-US',
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjMyNDc2Y2IyMzU2Yjk0NmMzZTFhODMxMTUzN2QxNiIsInN1YiI6IjY2MWQ1YTUxZWMwYzU4MDE3Yzc0ZDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gW2AlEPDbWxRQq-95o4hNQdj5sxc7RASvW8p5LJjPvo'
      }
    };
    $.ajax(options).done(function (response) {
      var actors = response.cast.slice(0, 3).map(actor => actor.original_name).join(", ");
      callback(actors);
    });
  }

  // Función para buscar películas y actualizar sugerencias.
  function searchMovies(query) {
    const options = {
      url: 'https://api.themoviedb.org/3/search/movie?query=' + encodeURIComponent(query) + '&include_adult=false&language=en-US&page=1',
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjMyNDc2Y2IyMzU2Yjk0NmMzZTFhODMxMTUzN2QxNiIsInN1YiI6IjY2MWQ1YTUxZWMwYzU4MDE3Yzc0ZDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gW2AlEPDbWxRQq-95o4hNQdj5sxc7RASvW8p5LJjPvo'
      }
    };

    $.ajax(options).done(function (response) {
      displaySuggestions(response.results);
    }).fail(function () {
      console.error("Error al realizar la solicitud a la API");
    });
  }

  // Función para mostrar sugerencias en el menú desplegable y obtener IMDb links.
  function displaySuggestions(movies) {
    suggestionsContainer.innerHTML = ''; // Limpiar resultados anteriores
    if (movies.length === 0) {
      suggestionsContainer.style.display = 'none';
      return;
    }
    movies.forEach(movie => {
      const suggestElement = document.createElement('div');
      suggestElement.classList.add('suggest-element');
      suggestElement.textContent = movie.original_title; // Usar original_title de la API

      // Solicitar el IMDb ID al hacer clic
      suggestElement.onclick = function () {
        fetchIMDbLink(movie.id, function (linkIMDB) {
          window.open("https://www.imdb.com/title/" + linkIMDB, '_blank');
        });
      };

      suggestionsContainer.appendChild(suggestElement);
    });
    suggestionsContainer.style.display = 'block'; // Mostrar sugerencias
  }

  // Función para obtener el link de IMDb usando la API de TMDB
  function fetchIMDbLink(id, callback) {
    const options = {
      url: "https://api.themoviedb.org/3/movie/" + id + "?language=en-US",
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjMyNDc2Y2IyMzU2Yjk0NmMzZTFhODMxMTUzN2QxNiIsInN1YiI6IjY2MWQ1YTUxZWMwYzU4MDE3Yzc0ZDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gW2AlEPDbWxRQq-95o4hNQdj5sxc7RASvW8p5LJjPvo'
      }
    };
    $.ajax(options).done(function (response) {
      callback(response.imdb_id); // Pasar IMDb ID al callback
    }).fail(function () {
      console.error("Error al obtener el link de IMDb");
    });
  }

});
