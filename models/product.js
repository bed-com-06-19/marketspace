const mongoose = require('mongoose');

const productSchema = mongoose.Schema({  
    name: {
      type:String,
      required:true,
      trim:true
   },
   description:{
      type: String,
      required: true,
      trim: true
   },
   richDescription:{
      type: String,
      default:''
   },
   image:{ String,
      type : String,
      required: true
   },
   images: [{
     type: String
   }],
    brand: {
      type:String,
      default:''
    },
    price : {
      type: Number,
      default:0
    },
    category:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Category',
       required:true
    },
   
    countInStock :{
      type: Number,
      required:true,
      min:0,
      max:10000
    },
    rating:{
      type:Number,
      default:0,
    },
    numReviews:{
      type:Number,
      default:0,
    },
    isFeatured:{
      type:Boolean,
      default:true,
    },
    dateCreated:{
      type:Date,
      default:Date.now,
    },
 
  })

  productSchema.virtual('id').get(function () {
    return this._id.toHexString();
  });
  
  productSchema.set('toJSON', {
    virtuals : true,

  });

  exports.Product = mongoose.model('Product',productSchema);
