const express = require('express');
const router = express.Router();

const users = require('./userDb');
const posts = require('../posts/postDb');
const {validateUserId, validateUser, validatePosts} = require('../middleware/middleware')


router.get('/', (req, res) => {
  users.get()
  .then(user => {
    res.status(200).json(user)
  })
  .catch(error => {
    console.log('error with get user:', error);
    res.status(404).json({errorMessage: `Oops, couldn't find what you were looking for.`})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;

  users.getById(id)
  .then(user => {
    if(!user){
      res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
    } else {
      res.status(200).json(`Success!!! You found ME...${user.name}`)
    }
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;

  users.getUserPosts(id)
  .then(post => {
    // console.log({post})
    if(post === 0){
      res.status(400).json({errorMessage: `Oops, we couldn't find any posts!`})
    } else {
    res.status(200).send(post.map(text => `${text.text}`))
    }
  })
});

router.post('/', (req, res) => {
  const body = req.body;

  users.insert(body)
  .then(user => {
    res.status(201).json({successMessage:`${user.name} added to database!`})
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: "There was an issue with saving user to the database."})
  })
});

router.post('/:id/posts', validatePosts, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const post = {...body, user_id: id}

  posts.insert(post)
  .then(aPost => {
    res.status(201).json(`Success!!! You're post was saved! See: ${aPost}`)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: "There was an issue with saving user to the database."})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;

  user.remove(id)
  .then(user => {
    if(user > 0 && user){
      res.status(200).json(`Successfully removed user: ${user}`)
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: "The user could not be removed." });
  })
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  users.update(id, body)
  .then(user => {
    res.status(200).json(`Success!!! The user has been updated...See: ${req.user}`)
  })
});

module.exports = router;
