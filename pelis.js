document.addEventListener("DOMContentLoaded", function(){
    //Cogo el boton del search
    var filmButton = document.getElementById("filmButton");
    //Copio el div con las clases de bootstrap, que tenemos en el html
    var cardMovie = document.getElementsByClassName("col-md-4")[0];
    //Guardo todas las cartas de pelis que tenemos predefinidas en el html
    var cardsMoviesPredefined = document.getElementsByClassName("col-md-4");
    //Cuando clickemos el botón de buscar, hacemos petición a la api, con el valor del input
    filmButton.addEventListener("click", function(){
        var movieName = document.getElementById("filmSearch").value;
        var movies = [];
        const settings = {
            async: true,
            crossDomain: true,
            url: "https://api.themoviedb.org/3/search/movie?query="+ movieName + "&include_adult=false&language=es&page=1",
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjMyNDc2Y2IyMzU2Yjk0NmMzZTFhODMxMTUzN2QxNiIsInN1YiI6IjY2MWQ1YTUxZWMwYzU4MDE3Yzc0ZDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gW2AlEPDbWxRQq-95o4hNQdj5sxc7RASvW8p5LJjPvo'
            }
          };
          //Cuando tengamos la respueta, borramos todas las cartas predifinidas
          $.ajax(settings).done(function (response) {
            movies = response;
            console.log(movies);
            for (var i = 3; i >= 0; i--){
                cardsMoviesPredefined[i].remove()
            }
            for (var i = 0; i < movies.length; i++) {
                //E inyectaremos los resultados al html, con la carta que tenemos guardada
                //Tendremos que crear una nueva carta para cada resultado de la peti a la api
                // cardMovie.nextSibling.innerHTML = movies[i]
            }
            
          });
    })
})