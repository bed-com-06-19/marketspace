const {Product} = require('../models/product');
const { Category } = require('../models/category');
const express = require ('express');
const router = express.Router();
const mongoose = require('mongoose');



router.get(`/`, async (req, res) =>{

    let filter = {};
    if (req.query.categories)
    {
        filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');
 
    if (!productList){
       res.status(500).json({sucess:false})
    }
    res.send(productList);
 } )

 router.get(`/:id`, async (req, res) =>{
   const product = await Product.findById(req.params.id);

   if (!product){
      res.status(500).json({sucess:false})
   }
   res.send(product);
} )

router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('invalid category ')

    let product = new Product({
       name:req.body.name,
       description:req.body.description,
       richDescription:req.body.richDescription,
       image:req.body.image,
       brand:req.body.brand,
       price:req.body.price,
       category:req.body.category,
       countInStock:req.body.countInStock,
       rating:req.body.rating,
       numReviews:req.body.numReviews,
       isFeatured:req.body.isFeatured,
 
    })
 
    product = await product.save();
   
    if(!product)
    return res.status(500).send('the product cannot be created ')

    res.send(product);
  })

  router.put('/:id', async (req, res)=>{
   if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).send('invalid product id ')
   }
   const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('invalid category ')

   const product= await Product.findByIdAndUpdate(
       req.params.id,
       {
         name:req.body.name,
         description:req.body.description,
         richDescription:req.body.richDescription,
         image:req.body.image,
         brand:req.body.brand,
         price:req.body.price,
         category:req.body.category,
         countInStock:req.body.countInStock,
         rating:req.body.rating,
         numReviews:req.body.numReviews,
         isFeatured:req.body.isFeatured,
      
      },
      {new: true}

   )
    if (!product) {
           return res.status(484).send('The product cannot be created');
       }
   
})
router.delete('/:id', async (req, res) => {
   try {
       const product = await Product.findByIdAndDelete(req.params.id);

       if (product) {
           return res.status(200).json({ success: true, message: 'The product is deleted' });
       } else {
           return res.status(404).json({ success: false, message: 'The product not found' });
       }
   } catch (error) {
       console.error(error);
       return res.status(400).json({ success: false, error: error.message });
   }
})

router.get(`/get/count`, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        
        if (!productCount) {
            res.status(500).json({ success: false });
        }

        res.send({
            productCount: productCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
})
router.get(`/get/featured/:count`, async (req, res) => {
    try {
        const count = req.params.count ? req.params.count: 0
        const products = await Product.find({isFeatured:true}).limit(+count)
        
        if (!products) {
            res.status(500).json({ success: false });
        }

        res.send(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});




  module.exports = router;