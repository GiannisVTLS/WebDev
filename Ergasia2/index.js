const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Favorite = require('./models/favorites')
const expressHbs = require('express-handlebars');

const uri = "mongodb+srv://GiannisVitalis:3150011@webdev.mlngs.mongodb.net/web-dev?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true})
    .then((result) => {
        console.log('Connected to db')
        app.listen(8080, ()=> {
            console.log('listening at port 8080')
            const fs = require('fs');
            
            Favorite.find()
                .then((result)=>{
                    favorites = result;
                })
        });
    })
    .catch(err => {console.log(err)
    })

var favorites = []

function filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
}

app.use('/static',
    express.static(__dirname + '/public'))

app.use(express.json({limit: '1mb'},{type: ['application/json']})) //Check documentation

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
    Favorite.find()
    .then((result)=>{
        favorites = result;
    })
    .then(() =>{
        res.json(favorites)
    })
})

app.post('/api/favorites', (request, response) => {
    favorites = favorites.map(function(item){
        return {workid : item["workid"], author : item["author"], title: item["title"]}
    });
    let filter = JSON.stringify(request.body.keyword).replace(/\"/g, "").toLowerCase()
    filter = filter.trim()
    filter = filter.split(" ")
    let concatInfo = [];
    for(let i=0; i<filter.length; i++) {
        concatInfo.push(filterByValue(favorites, filter[i]))
    }

    let allTitles = [].concat.apply([], concatInfo);
    allTitles = allTitles.filter((value,index,array)=>array.findIndex(t=>(t.workid === value.workid))===index)
    response.json({
        status: "success",
        titles: allTitles
    });
})

app.post('/api/fav', function(request, response){
    const works = request.body
    
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

    const favor = new Favorite({
        workid: request.body.workid,
        author: request.body.author,
        title: request.body.title
    })

    favor.save()
    .then((result) =>{
        response.send(result)
    })
    .catch(err => console.log(err))
})

app.post('/api/edit/:id', function(req,res){
    let title = req.body.title
    let author = req.body.author
    let review = req.body.comment
    let filter = {workid: req.params.id}
    let update;
    if(title != '' && author!='' && review!=''){ 
        update = {
            $set: {
                title: title,
                author: author,
                review: review
            }
        }
    }else if(author!='' && review!=''){
        update = {
            $set: {
                author: author,
                review: review
            }
        }
    }else if(title!='' && review!=''){
        update = {
            $set: {
                title: title,
                review: review
            }
        }
    }else if(review!=''){
        update = {
            $set: {
                review: review
            }
        }
    }else if(author!=''){
        update = {
            $set: {
                author: author
            }
        }
    }else{
        update = {
            $set: {
                title: title
            }
        }
    }

    Favorite.updateOne(filter, update, (err)=>{
        if(err) return res.status(200).json({
            error: true,
            code: 115,
            message: "Error to update user!"
        })})
    res.redirect('/static/index.html')
})

app.delete('/api/favorites/:id', function(req, res){
    Favorite.deleteOne({workid: req.params.id})
    .then(() =>{
        Favorite.find()
        .then((result)=>{
            favorites = result;
        })
    })
    res.json(true);
})

app.engine('hbs', expressHbs({
    extname: 'hbs',
    defaultLayout: 'edits.hbs'
}));

app.set('view engine', 'hbs');
var edit;
app.get("/static/api/edit", function(req, res) {
    res.render('edit-books', {
        workid: edit[0].workid,
        title: edit[0].title,
        author: edit[0].author,
    });
});

app.post("/api/edit", function(req,res){
    let toEdit = req.body.workid
    Favorite.find({workid: toEdit})
    .then((result) =>{
        edit = result;
    }).then(()=> res.json(true))
})