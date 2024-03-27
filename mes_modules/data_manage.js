/*****************************************************************/
/*                                                               */
/* module de gestion des données avec MongoDB (Outil : mongoose) */
/*                                                               */
/*****************************************************************/

//importation des modules utiles
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mongoUrl = 'mongodb+srv://geniebibi:geniebibi@bcsite.ujmmigl.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUrl)
    .then(() => { 
        console.log('Connected to the database.');
     })
    .catch((err) => {
        console.log('An error occured when trying to connect to the databasese :', err);
    });

//création du schema pour l'utilisateur
const userSchema = new Schema({
    pseudo: String,
    email: String,
    password: String,
    publicationLikee: Array
});

//création du model d'utilisateur
const Users = mongoose.model('users', userSchema);

//création du schema pour les commentaires
const commentaireSchema = new Schema({
    auteur: String,
    contenu: String,
    date_ajout: { type: Date, default: Date.now }
});

//création du model de commentaire
const Commentaire = mongoose.model('Commentaire', commentaireSchema);

//création du schema pour les publications
const postSchema = new Schema({
    auteur: String,
    date_ajout: { type: Date, default: Date.now },
    titre: String,
    contenu: String,
    likes: { type: Number, default: 0 },
    commentaires: [{ type: Schema.Types.ObjectId, ref: 'Commentaire' }] //référence à l'objet commentaire
});

//création du model de publication
const Posts = mongoose.model('posts', postSchema);

module.exports = { Users, Posts, Commentaire };