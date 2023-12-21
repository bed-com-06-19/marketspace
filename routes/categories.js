const {Category} = require ('../models/category')
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const CategoryList = await Category.find();

    if(!CategoryList) {
        res.status(500).json({success: false})
    }
    res.send(CategoryList);
})
module.exports = router;