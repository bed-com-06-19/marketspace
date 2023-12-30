const {User} = require ('../models/user')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get(`/`, async (req, res) => {
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.post('/', async (req, res) => {
    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            street: req.body.street,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        });

        user = await user.save();

        if (!user) {
            return res.status(484).send('The user cannot be created');
        }

        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;