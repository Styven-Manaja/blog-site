/*****************************************************************/
/*                                                               */
/*                module pour trouver et afficher les            */
/*                        publications                           */
/*                                                               */
/*****************************************************************/

//importation du model de post
const { Posts } = require("./data_manage");

exports.find_post = function(req, res, callbackFunction) {
    //trouver tous les publications dans la base de donnée
    Posts.find()
        .then((posts) => {
            callbackFunction(posts);
        })
        .catch((err) => {
            console.log('Error finding posts:', err);
            res.status(500).send('Error finding posts');
        })
};

exports.find_specific_post = function(req, res, userName, callbackFunction) {
    Posts.find({ auteur: userName })
        .then((posts) => {
            callbackFunction(posts)
        })
        .catch((err) => {
            console.log('Error finding posts:', err);
            res.status(500).send('Error finding posts');
        })
};