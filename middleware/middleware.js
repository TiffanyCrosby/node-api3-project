const users = require('../users/userDb')

exports.logger = (req, res, next) => {
    const method = req.method;
    const endpoint = req.originalUrl;
    const base = req.baseUrl ? `from ${req.baseUrl}` : "";

    console.log(`${method} to ${endpoint} ${base} at ${new Date().toISOString()}`);

    next();
}

exports.validateUserId = async (req, res, next) => {
    const id = req.params.id;
    const user = await users.getById(id);
    if (!user){
        res.status(400).json({ message: "invalid user id" })
    } else {
        req.user = user;
    }
    next();
}

// exports.validateUser = (req, res, next) => {
//     const user = req.body;

//     if(Object.keys(user).length === 0){
//         res.status(400).json({ message: "missing user data" })
//     } else if(!user.name) {
//         res.status(400).json({ message: "missing required name field" })
//     }

//     next();
// }

exports.validateUser = (req, res, next) => {
    const body = req.body;

    if (Object.entries(body).length === 0 && body.constructor === Object) {
      res.status(400).json({ message: `data for user is missing`})
    } else if (!req.body.text) {
      res.status(400).json({ message: `text field is required`})
    } else if (req.body) {
      return next()
      }
    }
  

exports.validatePosts = (req, res, next) => {
    const post = req.body;

    if(Object.keys(post).length === 0){
        res.status(400).json({ message: "missing post data" })
    } else if(!post.text){
        res.status(400).json({ message: "missing required text field" })
    }

    next();
}

exports.notFound = (req, res, next) => {
    res.status(404).json({errorMessage: "Oops, we didn't find what you're looking for!"})
}