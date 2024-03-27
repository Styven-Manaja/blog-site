/*****************************************************************/
/*                                                               */
/*                module de configuration de passport            */
/*                                                               */
/*****************************************************************/

//importation des modules externes
const passport = require('passport'); //module principale
const LocalStrategy = require('passport-local').Strategy; //définition du stratégie à utiliser

//import de Users
const { Users } = require('./data_manage');

exports.config = function() {
    //configuration de passport
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done) {
        Users.findOne({ email: email })
            .then((user) => {
                if(!user) {
                    return done(null, false, { message: 'Utilisateur non trouvé.' })
                }
                if(user.password !== password) {
                    return done(null, false, { message: 'Mot de passe incorrecte.' })
                }
                return done(null, user);
            })
            .catch(err => done(err));
    }));

    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findById(id)
            .then((user) => {
                return done(null, user);
            })
            .catch(err => done(err));
    });
}

exports.auth = function(req, res, next) {
    return passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.flash('error', 'Wrong nickname or password');
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/home'), next();
        });
    })(req, res, next);
};