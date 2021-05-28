var favWorks = []
var templates = {};
var favButtons = [];

if (document.URL.includes("favorites.html")) {
    window.addEventListener('load', getFavorites())
}

function getFavorites(){
    fetch('/api/favorites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data =>{
        favWorks = data
        return printResults()
    })
    .then((data) =>{
        favButtons = document.querySelectorAll('[id^="fav-key-"]');
        for(const button of favButtons){
            button.addEventListener('click', (button) => {
                console.log(button)
                let id = button.target.parentElement.id.slice(8)
                id = id.split("_").shift()
                fetch(`/api/favorites/${id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(() => location.reload())
            })
        }
    })
}

function printResults(){ //**CHANGE HERE INDEX IF USE 2 PAGES */
    templates.favResults = Handlebars.compile(`
        {{#each this}}
            <section class="fav-container"  id="{{workid}}">
                <button id="edit-key-{{@key}}" target="_edit-favorite"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                <h2 class="fav-title"">{{title}}</h2>
                <q class="fav-author">{{author}}</q>  
                <button id="fav-key-{{@key}}_active" target="_book-favorite"><i class="fa fa-heart" aria-hidden="true"></i></button>                                     
            </section>
        {{/each}}`)
    
    templates.noResults = Handlebars.compile(`
    <figure id="no-results">
        <img alt="no-results" src="@Resources/search.png" height="200px">
        <figcaption>You don't have any favorites.</figcaption>
    </figure>`)
    if(favWorks.length > 0){
        let temp = templates.favResults(favWorks)
        let div = document.getElementById("fav-list")
        div.innerHTML = temp
    }else{
        let temp = templates.noResults()
        let div = document.getElementById("fav-list")
        div.innerHTML = temp
    }
    
}