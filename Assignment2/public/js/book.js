var templates = {};

/**On load, print favorites and clear the filter search*/
if (document.URL.includes("favorites.html")) {
    window.addEventListener('load', getFavorites())
    document.getElementById('filter-input').value = ''    
} 

/**Wait 1 second for more user inputs
 * after 1 second send the user input to the server
 * server will match keywords to titles and return the results
 * call printResults() with the titles that matched
 */
var timeout
function filterResults(){
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        let filterValue = document.getElementById('filter-input').value
        fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword: filterValue
            })
        })
        .then(res => res.json())
        .then(data => {
            printResults(data.titles);
        })
    }, 1000);
}

/**Get all favorites from server
 * Then print the results
 * Then add an on click event listener on the heart button that will delete the entry if pressed
 */
function getFavorites(){
    fetch('/api/favorites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data =>{
        printResults(data)
    })
}

function deleteFavorite(button){
    let id = button.target.parentElement.id.slice(8)
    id = id.split("_").shift()
    fetch(`/api/favorites/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(() => location.reload())
}

/**
 * on click of the trash can icon
 * find which field was clicked (either title or author)
 * and delete the field from that entry
 */
function deleteValue(e){
    let deleteField = e.target.parentNode.id.slice(7)
    deleteField = deleteField.split("-").shift()
    let deleteWork = e.target.parentNode.id.slice(14)

    fetch(`/api/favorites/${deleteWork}/${deleteField}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => location.reload())
}

/**
 * On click of the pencil icon
 * Post the info of the clicked work to the server
 * Once the server gets the info go to the dynamically created edit page 
 */
function editFavorites(e){
    let editID = e.target.parentNode.id.slice(9)
    fetch('/api/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            workid: editID
        })
    }).then(() => window.location.href = '/static/api/edit')
}

function printResults(prints){
    templates.favResults = Handlebars.compile(`
        <h1>User Favorites</h1>
        {{#each this}}
            <section class="fav-container"  id="{{workid}}">
                <button id="edit-key-{{workid}}" onclick="editFavorites(event)" target="_edit-favorite"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                <button id="delete-titles-{{workid}}" onclick="deleteValue(event)" target="_remove-title"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                <h2 class="fav-title"">{{title}}</h2>
                <button id="delete-author-{{workid}}" onclick="deleteValue(event)" target="_remove-author"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                <q class="fav-author">{{author}}</q> 
                <button id="fav-key-{{workid}}_active" target="_book-favorite" onclick="deleteFavorite(event)"><i class="fa fa-heart" aria-hidden="true"></i></button>                            
            </section>
            {{#if (hasreview review)}}
                <section class="fav-review">
                    <h3>User Review</h3>
                    <p>{{review}}</p>
                </section>
            {{/if}}
        {{/each}}`)
    
    templates.noResults = Handlebars.compile(`
    <figure id="no-results">
        <img alt="no-results" src="@Resources/search.png" height="200px">
        <figcaption>OOPS! Found Nothing.</figcaption>
    </figure>`)
    if(prints.length > 0){
        let temp = templates.favResults(prints)
        let div = document.getElementById("fav-list")
        div.innerHTML = temp
    }else{
        let temp = templates.noResults()
        let div = document.getElementById("fav-list")
        div.innerHTML = temp
    }
    
}

Handlebars.registerHelper('hasreview', function (value) {
    if(typeof value !='undefined') {
        return true;
    }else{
        return false;
    }
});