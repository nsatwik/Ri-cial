const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = async function (req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // Post.find({}, function(err, post) {
    //     res.render('home', {
    //         title: 'Ri-cial | Home',
    //         post: post
    //     });
    // });

    try {
        let post = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },
                populate: {
                    path: 'likes'
                }
            }).populate('comments')
            .populate('likes');
        // .exec(function (err, post) {
        // });

        let users = await User.find({});

        res.render('home', {
            title: 'Ri-cial | Home',
            posts: post,
            all_users: users
        });

    } catch (err) {
        console.log(`Error ${err}`);
        return;
    }

};
