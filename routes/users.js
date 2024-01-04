const {User} = require ('../models/user')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, message: 'The user with the given id was not found' });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

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

router.post('/login', async (req, res) => {
    try {

        console.log('Received request at:', req.path);
        const user = await User.findOne({ email: req.body.email });
        const secret = process.env.secret;

        if (!user) {
            return res.status(400).send('The user not found.');
        }

        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                { 
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                secret,
                { expiresIn: '5d' }
            )

            console.log('User:', user);
            console.log('Generated Token:', token);

            res.status(200).send({ user: user.email, token: token });
        } else {
            return res.status(400).send('Password is wrong.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
//     app.use((req, res, next) => {
//         console.log('Request Path:', req.path);
//         console.log('Request Method');
    
    
// });
});



router.post('/register', async (req, res) => {
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
})
router.get(`/get/count`, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        
        if (!userCount) {
            res.status(500).json({ success: false });
        }

        res.send({
            userCount: userCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
 
        if (user) {
            return res.status(200).json({ success: true, message: 'The user is deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'The user not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
 })


module.exports = router;
