const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app =express();
mongoose.connect('mongodb://0.0.0.0/forum_db', {useNewUrlParser:true});


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const MessageSchema = new mongoose.Schema({
    userName: {type: String, min:3, max:50, require: [true, 'Name is required'],},
    message: {type: String, min:3, max:250, require: [true, 'Message is required']}
})

const ForumPostSchema = new mongoose.Schema({
    userName: {type: String, min:3, max:50, require: [true, 'Name is required'],},
    message: {type: String, min:3, max:250, require: [true, 'Message is required']},
    comment: [MessageSchema]
})

const Post = mongoose.model('post', ForumPostSchema);

app.get('/', (req, res) => {
    Post.find({})
    .then(post => {
        res.render('message',{post: post, message: ''});
    })
    .catch(error => handleError(error))
})

app.get('/message', (req, res) => {
    Post.find({})
    .then(post => {
        res.render('message',{post: post, message: ''});
    })
    .catch(error => handleError(error))
})


// post principal
app.post('/message', function(req, res) {
    let { userName, message} = req.body

    let post = new Post()
    post.userName = userName
    post.message = message
    console.log(post)
    post.save()
    .then(
        () => res.redirect('/message')
    )
    .catch(error => handleError(error))
})

//post comentario
app.post('/postmessage/:id', function(req, res) {
    Post.findOneAndUpdate({_id: req.params.id}, {$push: {comment: req.body}})
    .then(
        () => res.redirect('/message')
    )
    .catch(error => handleError(error))
})



function handleError(error) {
        console.log(error);
        return error
}


const port = 8000;

app.listen(port);
console.log(`server is listening on port ${port}`)