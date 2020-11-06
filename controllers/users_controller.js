const { urlencoded } = require('express');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        res.render('user_profile', {
            title: 'Profile',
            profile_user: user
        });
    });
};

module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
        //         req.flash('success', 'Updated!');
        //         return res.redirect('back');
        //     });
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log('MULTER ERROR', err) }

                console.log(req.file);

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {

                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back');
            });
        } catch (err) {
            req.flash('error', err);
            console.log(`Err ${err}`);
            return res.redirect('back');
        }

    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// render the sign in page
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.render('user_sign_in', {
        title: 'Ri-cial | Sign In'
    });
};

// render the sign up page
module.exports.signUp = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.render('user_sign_up', {
        title: 'Ri-cial | Sign Up'
    });
};

// get the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords does not match');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { req.flash('error', err); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { req.flash('error', err); return }

                return res.redirect('/users/sign-in');
            })
        } else {
            req.flash('success', 'Username Already exits, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create session
module.exports.createSession = function (req, res) {
    req.flash('success', 'Yay! Logged In Successfully');
    return res.redirect('/');
};


// to sign-out
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'Logged Out Successfully !');
    return res.redirect('/');
}