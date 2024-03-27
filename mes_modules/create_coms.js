/*****************************************************************/
/*                                                               */
/*             module pour la création des commentaires          */
/*                                                               */
/*****************************************************************/

//importation du model des commentaires et de Posts
const { Commentaire, Posts } = require("./data_manage");

var titre, auteur, contenu;
var info = [titre, auteur, contenu];

exports.new_coms = function(req, res, info) {
    var coms = new Commentaire({
        auteur: info[1],
        contenu: info[2]
    });

    coms.save()
        .then((comment) => {
            return Posts.findOneAndUpdate({ titre: info[0] }, { $push: { commentaires: comment._id } });
        })
        .then(() => {
            return res.redirect('/' + info[0]);
        })
        .catch((err) => {
            console.log('An error occured : ', err);
        });
};
