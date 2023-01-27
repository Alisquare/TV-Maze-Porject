// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for


} // showSearchResults

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>"; 
   } // for       
   output += "</ul>";
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    elemDiv.classList.add("showbox");
    var elemImage = document.createElement("img");
    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    elemGenre.classList.add("genre");
    var elemRating = document.createElement("div");
    elemRating.classList.add("rating");
    var elemSummary = document.createElement("div");
    elemSummary.classList.add("summary");
    
    // add JSON data to elements
    elemImage.src = tvshowJSON.show.image.medium;
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    elemSummary.innerHTML = tvshowJSON.show.summary;
    
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
    
    // get id of show and add episode list
    var showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes


// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
  
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    
    var elemEpisodes = document.createElement("div");  // creates a new div tag
    var output = "<ol>";
    for (episode in data) {
        output += "<li><a href='javascript:fetchEpisodeInfo(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
    }
    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
    elemEpisodes.classList.add("epis");
        
} // showEpisodes

function fetchEpisodeInfo(episodeId){
  fetch('https://api.tvmaze.com/episodes/' + episodeId)
     .then(response => response.json())
     .then(data => showLightBox(data))

}

// open lightbox and display episode info
function showLightBox(data){
  console.log(data)   
  document.getElementById("lightbox").style.display = "block";
     
     
     // show episode info in lightbox
     //document.getElementById("message").innerHTML = //"<h3>The episode unique id is " + episodeId + "</h3>";
     if("image" in data && data.image != null){
        var episodeImage = document.createElement("img")
        episodeImage.src = data.image.medium
        document.getElementById("message").appendChild(episodeImage)
     }
     document.getElementById("message").innerHTML +=  "<br>Name: " + data.name + "<br> Season: " + data.season + "<br> Episode: " + data.number + "<br> Summary: " + data.summary;
     //"<p>Your job is to make a fetch for all info on this" + " episode and then to also show the episode image, name, season, number, and description.</p>";
     
} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("message").innerHTML = ""
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 


 if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}



