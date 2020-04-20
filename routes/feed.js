const express = require("express");
const router = express.Router();

const feedCollectionRoute = '/post';
const feedContr = require('../controllers/feed');

router.get(feedCollectionRoute, (req, res, next) => {
    feedContr.getPost(req, res, next);
});

router.post(feedCollectionRoute, (req, res, next) => {
    feedContr.createPost(req, res, next);
});

module.exports = router;