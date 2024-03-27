/*****************************************************************/
/*                                                               */
/*           module pour la modificatio des commentaires         */
/*                                                               */
/*****************************************************************/

//imporattion du model de commentaire
const { Commentaire } = require('./data_manage');

exports.update_coms = function(req, res, id, new_content, post_titre) {
    Commentaire.findByIdAndUpdate(id, { $set: { contenu: new_content } })
        .then(() => {
            res.redirect('/' + post_titre);
        })
        .catch((err) => {
            console.log('An error occured.');
        })
}