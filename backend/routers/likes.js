import { Router } from 'express'
import * as data from '../data.js'
import { verifyToken } from './authentication.js';
import { sendEvent } from '../event.js';

const router = Router();

function validateUserAndBeer(req, res) {
    const { userName, beerId } = req.body;

    if (!userName || !beerId) {
        res.status(400).json({error: "A username and beerId is required"});
        return null;
    }

    const user = data.getUser(userName);
    if (!user) {
        res.status(404).json({error: "User not found"});
        return null;
    }

    const beer = data.getBeer(beerId);
    if (!beer) {
        res.status(404).json({error: "Beer not found"});
        return null;
    }

    return { user, beer }
}

router.get('/:name', verifyToken, (req, res) => {
    const userName = req.params.name;

    const result = data.getUser(userName);
    if (result) {
        const likedBeers = data.getLikedBeers(userName);
        return res.status(200).json(likedBeers);
    }
    return res.status(404).json({error: "User not found"});
})

router.post('/', verifyToken, (req, res) => {
    const result = validateUserAndBeer(req, res);
    if (!result) return;

    const { user, beer } = result;

    const loggedInUser = req.user.userName;
    if (loggedInUser !== user.name) {
        res.status(403).json({error: "That is not your name"})
    }

    const changes = data.insertLike(beer.id, user.name);
    if (changes === 0) {
        return res.status(409).json({error: "Like already exists"})
    }

    sendEvent('like', {
        userName: user.name,
        beer: beer.name
    })
    
    return res.status(201).json({message: "Like has been added"})
})

router.delete('/', verifyToken, (req, res) => {
    const result = validateUserAndBeer(req, res)
    if (!result) return;

    const { user, beer } = result

    const loggedInUser = req.user.userName;
    if (loggedInUser !== user.name) {
        return res.status(403).json({error: "You can only remove your own likes"})
    }

    const changes = data.deleteLike(beer.id, user.name);
    if (changes === 0) {
        return res.status(400).json({error: "Could not remove like"})
    }
    return res.status(200).json({message: "Successfully removed a like"})
})

export default router;