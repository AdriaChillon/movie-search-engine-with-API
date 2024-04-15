document.addEventListener("DOMContentLoaded", function(){
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://api.themoviedb.org/3/search/movie?query=matrix&include_adult=false&language=es&page=1',
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjMyNDc2Y2IyMzU2Yjk0NmMzZTFhODMxMTUzN2QxNiIsInN1YiI6IjY2MWQ1YTUxZWMwYzU4MDE3Yzc0ZDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gW2AlEPDbWxRQq-95o4hNQdj5sxc7RASvW8p5LJjPvo'
        }
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
})