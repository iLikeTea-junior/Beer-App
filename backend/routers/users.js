import { Router } from 'express';
import bcrypt from 'bcrypt'
import * as data from '../data.js'
import jwt from 'jsonwebtoken'
import { verifyToken, requireLevel } from './authentication.js'
import { SECRET } from './authentication.js';

const router = Router()

router.get('/', verifyToken, (req, res) => { // verifyToken
    const users = data.getUsers();
    res.status(200).json(users);
})

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    const result = data.getUser(userName);
    if (!result) return res.status(400).json({error: "Entered the wrong username/password"});

    const isMatch = await bcrypt.compare(password, result.bcryptPassword);
    if (!isMatch) return res.status(400).json({error: "Entered the wrong username/password"});

    const auth = jwt.sign({userName: userName, level: result.level}, SECRET, { expiresIn: '1h'})
    return res.status(200).json({message: "Logged in successfully", auth})
})

router.post('/', verifyToken, requireLevel(8), async (req, res) => {
    const { userName, password, level = 1 } = req.body;

    const result = data.getUser(userName);
    if (result) {
        return res.status(406).json({error: "The username is already in use"})
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        data.insertUser(userName, hashedPassword, level);
        res.status(201).json({message: "User was created successfully"})
    } catch (err) {
        res.status(500).json({error: err})
    }
})

export default router;