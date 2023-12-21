const mongoose = require('mongoose');

const userSchema = mongoose.Schema({  
    name: String,
    image: String,
    countInStock :{
       type : Number,
       require: true
    }
 
  })

  exports.User = mongoose.model('User',userSchema);