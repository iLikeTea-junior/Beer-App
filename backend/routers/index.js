// let router = module.exports = require('express').Router();
import { Router } from 'express'

import testRouter from './test.js'
import beerRouter from './beers.js'
import userRouter from './users.js'
import likeRouter from './likes.js'

const router = Router()

// Attach the router from the test.js file to the /test base url
router.use('/test', testRouter);
router.use('/beers', beerRouter);
router.use('/users', userRouter);
router.use('/likes', likeRouter);

// localhost:3000/hello
router.get("/hello", (req, res) => {
    res.send("Hello World!");
});

export default router;