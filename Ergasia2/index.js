const { Console } = require('console')
const express = require('express')
const app = express()
const path = require('path')

var favorites = []

app.use('/static',
    express.static(__dirname + '/public'))

app.use(express.json({limit: '1mb'},{type: ['application/json', 'text/plain']})) //Check documentation

app.use(express.urlencoded({ extended: false }))

app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})
app.get('/api/favorites', function (req, res){
    res.json(favorites)
})

app.post('/api/fav', function(request, response){
    const works = request.body
    const fs = require('fs');
    
    let item = []
    for(var key in works) {
        if(works.hasOwnProperty(key)){
            item = works[key]
        }
    }

    let workid = []
    item.forEach((item) =>{
        workid.push(item.workid)
    })

    let found = []
    favorites.forEach((f) =>{
        if(workid.includes(f.workid)) found.push(f.workid)
    })

    response.json({
        found: found
    });
})

app.post('/api/action', (request, response) => {
    const newFav = request.body
    for(var i=0; i< favorites.length;i++){
        if(favorites[i].workid === newFav.workid){
            favorites.splice(i,1);
        }
    }
    if(newFav.action === 'add') {
        favorites.push(newFav)
    }
    writeToJSON(favorites)
    
    response.json({
        status: "success",
        action: newFav.action,
        workid: newFav.workid,
        title: newFav.title,
        author: newFav.author
    });
})

app.delete('/api/favorites/:id', function(req, res){
    if(favorites.length <= req.params.id) {
        res.statusCode = 404;
        return res.send('Error 404: No quote found');
    }
    
    favorites.splice(req.params.id, 1);
    writeToJSON(favorites)
    res.json(true);
})

function writeToJSON(fav){
    const fs = require('fs');
    const jsonContent = JSON.stringify(fav);

    fs.writeFile("./favorites.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    }); 
}

app.listen(8080, ()=> {
    console.log('listening at port 8080')
    const fs = require('fs');

    let rawdata = fs.readFileSync('favorites.json');
    let favs = JSON.parse(rawdata);
    for(var i in favs) {
        favorites.push(favs[i])
    }
});