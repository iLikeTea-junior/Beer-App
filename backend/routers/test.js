// let router = module.exports = require('express').Router();
import { Router } from 'express'
const router = Router()

// localhost:3000/test/hi
router.get("/hi", (req, res) => {
    res.send("Hi World!");
});

export default router;
