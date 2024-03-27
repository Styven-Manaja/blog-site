/*****************************************************************/
/*                                                               */
/*          Module pour crée les nouveaux utilisateurs           */
/*                                                               */
/*****************************************************************/

//authentification de passport
const config_passport = require('./passport_config');

//import du model users
const { Users } = require("./data_manage");

var pseudo, email, password;
var info = [pseudo, email, password];

exports.new_user = function(req, res, next, info) {

    var user = new Users({
        pseudo: info[0],
        email: info[1],
        password: info[2]
    });
    
    user.save()
        .then(() => {
            console.log('User created succesfully.');
            config_passport.auth(req, res, next);
        })
        .catch((err) => {
            console.log('An error occured : ', err);
            return res.redirect('/sign-up');
        })
}