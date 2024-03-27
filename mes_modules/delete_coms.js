/*****************************************************************/
/*                                                               */
/*           module pour la suppression des commentaires         */
/*                                                               */
/*****************************************************************/

//importation du model des commentaires et de Posts
const { Commentaire, Posts } = require("./data_manage");

exports.delete_coms = function(req, res, post_titre, post_id, id) {
    Commentaire.deleteOne({ _id: id })
        .then(() => {
            Posts.findByIdAndUpdate(post_id, { $pull: { commentaires: id } })
                .then(() => {
                    res.redirect('/' + post_titre);
                })
                .catch((err) => {
                    console.log('An error occured : ', err);
                });
        })
        .catch((err) => {
            console.log('An error occured : ', err);
        });
};