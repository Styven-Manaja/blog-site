/*****************************************************************/
/*                                                               */
/*               module pour modifier les données dans           */
/*                           la base                             */
/*                                                               */
/*****************************************************************/

//importations des modeles à modifer
const { Users, Posts } = require("./data_manage");

//likée une publication
exports.like = function(id, userName) {
    return new Promise((resolve, reject) => {
        Posts.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true })
            .then((updatedPost) => {
                Users.updateOne({ pseudo: userName }, { $push: { publicationLikee: id } })
                    .then(() => {
                        resolve(updatedPost);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

//dislikée une publication
exports.dislike = function(id, userName) {
    return new Promise((resolve, reject) => {
        Posts.findByIdAndUpdate(id, { $inc: { likes: -1 } }, { new: true })
            .then((updatedPost) => {
                Users.updateOne({ pseudo: userName }, { $pull: { publicationLikee: id } })
                    .then(() => {
                        resolve(updatedPost);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
};
