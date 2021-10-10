const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Favorite = require('./models/favorites')
const expressHbs = require('express-handlebars');

/**Connect to the server and open a connection for the app*/
const uri = "mongodb+srv://GiannisVitalis:3150011@webdev.mlngs.mongodb.net/web-dev?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true})
    .then((result) => {
        console.log('Connected to db')
        app.listen(8080, ()=> {
            console.log('listening at port 8080')
        });
    })
    .catch(err => {console.log(err)
    })

/**Usage of findOneandUpdate method resulted in a deprecation warning without this
 * Mongoose's findOneAndUpdate pre-dates the MongoDB's findOneAndUpdate and thus uses findAndModify()
 * For the purposes of the assignment I used MongoDB's findOneAndUpdate by setting useFindAndModify to false
 */
mongoose.set('useFindAndModify', false);

app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})

app.use('/static',
    express.static(__dirname + '/public'))

app.use(express.json({limit: '1mb'},{type: ['application/json']})) //Check documentation

app.use(express.urlencoded({ extended: false }))


/**
 * Need to check if any works is already a favorite
 * Since forEach is not synchronous I wrapped it in a promise
 * When the promise is resolved return all the already favored works, if user search has no results returns empty array
 */
app.post('/api/works', function(request, response){
    const works = request.body.works
    
    let found = []
    var waitResults = new Promise((resolve, reject) => {
        if(typeof works != 'undefined'){
            if(Array.isArray(works)) {
                works.forEach((work, index, array) => {
                    Favorite.exists({workid: work.workid}, function(err, doc) {
                        if (err) {
                            console.log(err)
                        }else if(doc == true){
                            found.push(work.workid)
                        }
                        if (index === array.length -1) resolve();
                    })
                })
            }else{
                Favorite.exists({workid: works.workid}, function(err, doc) {
                    if (err) {
                        console.log(err)
                    }else if(doc == true){
                        found.push(works.workid)
                    }
                })
                resolve()
            }
        }else{
            resolve();
        }
    })

    waitResults.then(() => {
        response.json({
            found: found
        });
    })
})

/**Return all favorites */
app.get('/api/favorites', function (req, res){
    Favorite.find()
    .then((result)=>{
        res.json(result)
    })
})

/**Favorites searchbar
 * Get relevant fields "author, title, workid" from all titles in the DB
 * JSON stringify puts the keywords in "", so remove and lowercase
 * Remove unnecessary white spaces and split string in array of keywords
 * Search for every keyword results that match
 * Concat the results from every keyword in one array
 * Remove duplicates
 * Return results
 */
app.post('/api/favorites', (request, response) => {
    let favorites = []
    Favorite.find()
    .then((result)=>{
        favorites = result
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
        let allTitles = []
        allTitles = [].concat.apply([], concatInfo);

        allTitles = allTitles.filter((value,index,array)=>array.findIndex(t=>(t.workid === value.workid))===index)

        response.json({
            status: "success",
            titles: allTitles
        });
    })
})

function filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
}

/**Create a new favorite on the server */
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


/**Edit a field of a certain object in the DB */
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
    }else if(title!=''){
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

/**Delete a whole object in the DB */
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

/**Delete field of an object in the DB */
app.delete('/api/favorites/:id/:field', function(req, res){
    if(req.params.field == 'titles'){
        Favorite.findOneAndUpdate({workid: req.params.id}, {title: ''})
        .then(() =>{
            res.json(true)
        })
    }
    if(req.params.field == 'author'){
        Favorite.findOneAndUpdate({workid: req.params.id}, {author: ''})
        .then(() =>{
            res.json(true)
        })
    }
    
})

app.engine('hbs', expressHbs({
    extname: 'hbs',
    defaultLayout: 'edits.hbs'
}));

app.set('view engine', 'hbs');

/**Dynamically generated edit fields of entry page */
var edit;
app.get("/static/api/edit", function(req, res) {
    res.render('edit-books', {
        workid: edit[0].workid,
        title: edit[0].title,
        author: edit[0].author,
    });
});

/**Get from user the work that he wants to modify, find it and save it in order for the dynamic page to be generated correctily */
app.post("/api/edit", function(req,res){
    let toEdit = req.body.workid
    Favorite.find({workid: toEdit})
    .then((result) =>{
        edit = result;
    }).then(()=> res.json(true))
})