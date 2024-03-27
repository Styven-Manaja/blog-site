/*****************************************************************/
/*                                                               */
/*             module pour la création des publications          */
/*                                                               */
/*****************************************************************/

//importation du schema pour la publication
const { Posts } = require('./data_manage');

var author, title, content;
var info = [author, title, content];

exports.create_post = function(req, res, info) {
    var post = new Posts({
        auteur: info[0],
        titre: info[1],
        contenu: info[2]
    });

    post.save()
        .then(() => {
            console.log('Post created and posted!');
            return res.redirect('/home');
        })
        .catch((err) => {
            console.log('An error occured when creating post.');
            return res.redirect('/create_post');
        })
};