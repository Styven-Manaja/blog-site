/*****************************************************************/
/*                                                               */
/*          Blog and Chat web site (BC web site)                 */
/*          Copiright RANAIVOSON Manaja Styven 2024              */
/*                                                               */
/*****************************************************************/

// Import des modules externes
const express = require('express');
const {createServer} = require('node:http');
const { Server } = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// Import de mes modules
const createUser = require('./mes_modules/create_user');
const passport_config = require('./mes_modules/passport_config');
const createPost = require('./mes_modules/create_post');
const findPost = require('./mes_modules/find_post');
const updateData = require('./mes_modules/update_data');
const createComment = require('./mes_modules/create_coms');
const findComment = require('./mes_modules/find_comment');
const updatePost = require('./mes_modules/update_post');
const updateComs = require('./mes_modules/update_coms');
const deleteComs = require('./mes_modules/delete_coms');

/************************************************************/

// Création de l'application express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour définir le type MIME correct pour les fichiers CSS
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

// Passport
passport_config.config();

// Configuration de l'application express
const server = createServer(app);
const io = new Server(server);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'styven',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/************************************************************/

// Middleware d'authentification
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

/************************************************************/

//Gestion des likes et dislikes
io.on('connection', function(socket) {
    socket.on('like', function(data) {
        const postId = data.postId;
        const username = data.username;
        updateData.like(postId, username)
            .then((updatedPost) => {
                io.emit('updateLike', { postId: updatedPost._id, likesCount: updatedPost.likes, action: 'like' });
            })
            .catch((err) => {
                console.log('An error occurred while updating like: ', err);
            });
    });

    socket.on('dislike', function(data) {
        const postId = data.postId;
        const username = data.username;
        updateData.dislike(postId, username)
            .then((updatedPost) => {
                io.emit('updateLike', { postId: updatedPost._id, likesCount: updatedPost.likes, action: 'dislike' });
            })
            .catch((err) => {
                console.log('An error occurred while updating dislike: ', err);
            });
    });
});

/************************************************************/

// Routes destion des formulaires

app.post('/login', function(req, res, next) {
    var userMail = req.body.email;
    var userPassword = req.body.password;

    passport_config.auth(req, res, next);
});

app.post('/sign-up', function(req, res, next) {
    var userName = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var info = [userName, email, password];
    createUser.new_user(req, res, next, info);
});

app.post('/logout', function(req, res) {
    req.logOut(function(err) {
        if(err) { console.log(err) };
        res.redirect('/login');
    });
});

//Routes pour la création des publications

app.post('/create', function(req, res) {
    var author = req.body.author;
    var title = req.body.title;
    var content = req.body.content;

    var info = [author, title, content];
    createPost.create_post(req, res, info);
});

//Route pour la création des commentaires
app.post('/comment', function(req, res) {
    var auteur = req.body.auteur;
    var contenu = req.body.contenu;
    var titre = req.body.titre;

    var info = [titre, auteur, contenu];

    createComment.new_coms(req, res, info);
});

//Route pour la mis à jours des publications
app.post('/update', function(req, res) {
    var id = req.body.id;
    var newTitre = req.body.newtitre;
    var contenu = req.body.contenu;

    updatePost.update_post(req, res, id, newTitre, contenu);
});

//Route pour supprimer les publications
app.post('/delete', function(req, res) {
    var id = req.body.id;

    updatePost.delete_post(req, res, id);
});

//Routes pour la mis à jours des commentaires
app.post('/edit_coms', function(req, res) {
    var post_titre = req.body.post_titre;
    var id = req.body.id;
    var contenu = req.body.comment;

    updateComs.update_coms(req, res, id, contenu, post_titre);
});

//Route pour la suppression des commentaires
app.post('/delete_coms', function(req, res) {
    var post_titre = req.body.post_titre;
    var post_id = req.body.post_id;
    var id = req.body.id;

    deleteComs.delete_coms(req, res, post_titre, post_id, id);
});

/************************************************************/

// Routes les pages d'authentifications

app.get('/login', function(req, res) {
    const errorMessage = req.flash('error')[0];
    res.render('login', { errorMessage });
});

app.get('/sign-up', function(req, res) {
    res.render('sign_up');
});

//Routes pour la page d'acceuil

app.get('/home', isAuthenticated, function(req, res) {
    var user = req.user;

    findPost.find_post(req, res, function callbackFunction(posts) {
        res.render('home', { user, posts });
    });
});

//Routes pour le profil
app.get('/contact', isAuthenticated, function(req, res) {
    var user = req.user;

    res.render('contact', { user });
});

//Routes pour la page de création des publications

app.get('/new-post', isAuthenticated, function(req, res) {
    var user = req.user;
    res.render('create_post', { user })
});

//Routes pour les pages qui affiche un publication choisi

app.get('/:post', isAuthenticated, function(req, res) {
    var params = req.params;
    var titre = params.post;
    var user = req.user;

    findPost.find_post(req, res, function callbackFunction(posts) {
        findComment.find_comment(titre, function callbackFunction( comment_Array) {
            res.render('post', { user, titre, posts, comment_Array });
        });
    });
});

app.get('/:user/posts', isAuthenticated, function(req, res) {
    var user = req.user;
    var username = user.pseudo;

    findPost.find_specific_post(req, res, username, function callbackFunction(posts) {
        res.render('all_posts', { user, posts });
    });
});

app.get('/:post/edit', isAuthenticated, function(req, res) {
    var user = req.user;
    var params = req.params;
    var titre = params.post;

    findPost.find_post(req, res, function callbackFunction(posts) {
        res.render('update_post', { titre, posts, user });
    });
});

//Route pour la page d'acceuil
app.get('/', function(req, res) {
    res.sendFile(path.join('index.html'));
});

/************************************************************/

// Lancement du serveur
server.listen(PORT, function() {
    console.log('Server launched at port : ', PORT);
});
