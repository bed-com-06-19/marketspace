const {Product} = require('../models/product');
const { Category } = require('../models/category');
const express = require ('express');
const router = express.Router();
const mongoose = require('mongoose');
const  multer  = require('multer');


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isvalid =  FILE_TYPE_MAP[file.mimetype];
          let uploadError = new Error('invalid image type');

          if(isvalid){
            uploadError = null
          }
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
          
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
      
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })



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

router.post(`/`, uploadOptions.single('image'), async (req, res) =>{
    const category = await Category.findById(req.body.category);

    const isFeatured = req.body.isFeatured.trim() === 'true';

    if(!category) return res.status(400).send('invalid category ')
     const file = req.file;
     if(!file) return res.status(400).send('no image in the request')
    const fileName = req.file.filename
     const basePath= `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product({
       name:req.body.name,
       description:req.body.description,
       richDescription:req.body.richDescription,
       image:`${basePath}${fileName}`, //"http://localhost:8000/public/uploads/image-46575"
       brand:req.body.brand,
       price:req.body.price,
       category:req.body.category,
       countInStock:req.body.countInStock,
       rating:req.body.rating,
       numReviews:req.body.numReviews,
       isFeatured:isFeatured,
 
    })
 
    product = await product.save();
   
    if(!product)
    return res.status(500).send('the product cannot be created ')

    res.send(product);
  })

  router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product id');
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid category');
    }

    const product = await Product.findByIdAndUpdate(
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

   );
    if (!product) {
           return res.status(484).send('The product cannot be created');
       }
       res.send(product); // Send the updated product back to the client
    });
    
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

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid product id');
        }

        const files = req.files
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.fileName}`);
            })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).send('The product cannot be found');
        }
        res.send(product);
    }
);



  module.exports = router;