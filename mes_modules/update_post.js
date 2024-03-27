/*****************************************************************/
/*                                                               */
/*               module pour modifier de publications            */
/*                                                               */
/*****************************************************************/

//importation du model Posts
const { Posts } = require('./data_manage');

exports.update_post = function(req, res, id, newTitre, contenu) {
    Posts.updateOne({ _id: id }, { $set: {
        titre: newTitre,
        contenu: contenu,
    } })
        .then(() => {
            res.redirect('/:user/posts');
        })
        .catch((err) => {
            console.log('An error occured : ', err);
        })
}

exports.delete_post = function(req, res, id) {
    Posts.deleteOne({ _id: id })
        .then(() => {
            res.redirect('/:user/posts');
        })
        .catch((err) => {
            console.log('An error occured : ', err);
        })
};