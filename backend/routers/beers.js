import { Router } from 'express';
import * as data from '../data.js'
import { verifyToken, requireLevel } from './authentication.js'
import { sendEvent } from '../event.js';

const router = Router()

router.post('/', verifyToken, requireLevel(8), (req, res) => {
    const beer = req.body;

    if (!beer.name || !beer.percentage || !beer.brewery || !beer.category) {
        return res.status(400).json({error: "It is missing either name, percentage, brewery, or category"})
    }

    data.insertBeer(beer);
    res.status(201).json({
        message: "Beer has been created successfully",
        beerCreated: beer
    });

    sendEvent('new-beer', {
        newBeer: beer
    })
});

router.delete('/:id', verifyToken, requireLevel(8), (req, res) => {
    const beerId = req.params.id;

    const result = data.deleteBeer(beerId);
    if (result === 0) {
        res.status(404).json({error: "The beer was not found"})
    }

    res.json({message: "Successfully deleted"})
})

router.get('/', (req, res) => {
    const order = req.query.order;
    const filters = {
        brewery: req.query.brewery,
        category: req.query.category,
        minPercentage: req.query.minPercentage,
        maxPercentage: req.query.maxPercentage
    }

    const result = data.getBeers(order, filters);
    res.status(200).json(result);
})

export default router;