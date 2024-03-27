/*****************************************************************/
/*                                                               */
/*                module pour trouver et afficher les            */
/*                        commentaires                           */
/*                                                               */
/*****************************************************************/

//importation du model commentaire et de post
const { Commentaire, Posts } = require('./data_manage');

var comment_Array = [];

exports.find_comment = function(titre, callbackFunction) {
    Posts.findOne({ titre: titre })
    .then((post) => {
        if(post && post.commentaires && post.commentaires.length > 0) {
            var commentId_array = post.commentaires;
            // Utilisation de Promise.all pour attendre toutes les requêtes findById
            Promise.all(commentId_array.map(commentId => Commentaire.findById(commentId)))
                .then((comments) => {
                    callbackFunction(comments);
                })
                .catch((err) => {
                    console.log('An error occurred: ', err);
                    callbackFunction([]);
                });
        } else {
            callbackFunction([]);
        }
    })
    .catch((err) => {
        console.log('An error occurred: ', err);
        callbackFunction([]);
    });
}
