import { Router } from 'express';
import jwt from 'jsonwebtoken';

export const SECRET = 'iLikeTea'

export function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization')
    if (!authHeader) return res.status(401).json({error: "No token has been received or you are not logged in", authHeader});

    const token = authHeader.split(' ')[1];
    try {
        const user = jwt.verify(token, SECRET);
        req.user = user;
        next();
    } catch(err) {
        res.status(403).json({error: "Invalid token"})
    }
}

export function requireLevel(lvl) {
    return (req, res, next) => {
        if (!req.user || req.user.level < lvl) {
            return res.status(403).json({error: "Insufficient level"})
        }
        next();
    }
}