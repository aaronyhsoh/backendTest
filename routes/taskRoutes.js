const router = require('express').Router();
const axios = require('axios');
const { body, validationResult, query, check } = require('express-validator');
const uuid = require('uuid');
const { nanoid } = require('nanoid')
const Cafe = require('../models/Cafe')
const Employee = require('../models/Employee')
const utils = require('../utils/utils')

/**
 * Task 1
 */
router.get('/drinks', query('type').optional().matches('coffee|beer').withMessage('Only type of \'beer\' or \'coffee\' allowed.'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const type = req.query.type;
    let drinksArray = [];
    let [coffeeResult, beerResult] = await Promise.all([
        type === 'coffee' || type === undefined ? axios.get('https://api.sampleapis.com/coffee/hot').then(response => { return response.data }) : [],
        type === 'beer' || type === undefined ? axios.get('https://api.sampleapis.com/beers/ale').then(response => { return response.data }) : []
    ]);
    Promise.all([
        coffeeResult.map(coffee => {
            let newCoffeeObj = {
                Key: 'Coffee',
                name: coffee.title,
                price: "$" + Math.floor(Math.random() * (2000 - 800) + 800) / 100,
                rating: (Math.floor(Math.random() * (5000 - 1000) + 1000) / 1000).toString(),
                description: coffee.description,
                image: 'test',
                id: uuid.v4()
            }
            drinksArray.push(newCoffeeObj)
        }),
        beerResult.map(beer => {
            let newBeerObj = {
                Key: 'Beer',
                name: beer.name,
                price: beer.price,
                rating: beer.rating.average.toFixed(3),
                description: utils.mapBeerToDescription(beer.name),
                image: beer.image,
                id: uuid.v4()
            }
            drinksArray.push(newBeerObj)
        })
    ])

    if (type === undefined) {
        drinksArray.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return res.status(200).send(drinksArray)
})

/**
 * Task 2 Get cafes
 */
router.get('/cafes', query('location', 'Please enter a location'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const location = req.query.location
    let cafes = await Cafe.find({ location: location }, { _id: 0, __v: 0 }).sort({ employees: -1 })

    return res.status(200).send(cafes);
})

/**
 * Task 2 Get employees
 */
router.get('/cafes/employees', async (req, res) => {
    let employees = await Employee.find({}, { _id: 0, __v: 0 }).sort({ days_worked: -1 })
    return res.status(200).send(employees);
})

/**
 * Task 2 create cafe
 */
router.post('/cafe',
    [
        check('name').not().isEmpty().withMessage("Name is required"),
        check('location').not().isEmpty().withMessage("Location is required")
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        var cafe = new Cafe({
            name: req.body.name,
            description: req.body.description,
            logo: req.body.logo,
            location: req.body.location,
            id: uuid.v4()
        })
        await cafe.save()
        return res.status(200).send(`Cafe created`)
    })

/**
* Task 2 create cafe
*/
router.post('/cafe/employee',
    [
        check('name').not().isEmpty().withMessage("Name is required"),
        check('cafe').not().isEmpty().withMessage("Cafe is required")
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        var requestBody = req.body;
        const count = await Employee.countDocuments({ name: req.body.name })
        if (count > 0) {
            return res.status(400).send('Employee can only work for 1 cafe')
        }
        const cafe = await Cafe.findOne({ id: requestBody.cafe })
        const employee = new Employee({
            name: req.body.name,
            days_worked: req.body.days_worked,
            logo: req.body.logo,
            cafe: cafe,
            id: 'UI' + nanoid(7)
        })
        await employee.save()
        await Cafe.updateOne({ id: req.body.cafe }, {
            $inc: { 'employees': 1 }
        })

        return res.status(200).send(`Employee added`)
    })

module.exports = router