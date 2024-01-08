const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-items'); 

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    // .populate('orderItems');       
    .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' }});

  
  
    if (!order) {
      res.status(500).json({ success: false });
    }
    console.log(order); 
    
    res.send(order);
  });
  

router.post('/', async (req, res) => {
  try {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
       
        return newOrderItem._id; // Return the ID of the created OrderItem
      })

    );
    const orderItemsIdsResolved = await orderItemsIds;

     const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (OrderItemId) =>{
             const orderItem = await OrderItem.findById(OrderItemId).populate('product','price');
             const totalPrice = orderItem.product.price * orderItem.quantity;
              return totalPrice;
            } ))
       
             const totalPrice = totalPrices.reduce((a,b) => a +b, 0);

             console.log(totalPrices);

    let order = new Order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    order = await order.save();

    if (!order) {
      return res.status(484).send('The order cannot be created');
    }

    res.send(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
router.put('/:id', async (req, res)=>{
  const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
          status: req.body.status
        
      },

      {new: true}
  )
   if (!order) 
          return res.status(484).send('The order cannot be created')
      
          res.send(order);
  
})

router.delete('/:id', async (req, res) => {
  try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (order) {
        await order.orderItems.map(async orderItem => {
          await OrderItem.findByIdAndRemove(orderItem)
        })
          return res.status(200).json({ success: true, message: 'The order is deleted' });
      } else {
          return res.status(404).json({ success: false, message: 'The order not found' });
      }
  } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/get/totalsales', async (req, res)=>{
  const totalSales = await Order.aggregate([
    { $group: {_id: null, totalsales : { $sum:'$totalPrice' }}}
  ])
  if(!totalSales){
    return res.status(400).send('The order sales cannot be generated')
  }
  res.send({totalsales: totalSales.pop().totalsales});

})

router.get(`/get/count`, async (req, res) => {
  try {
      const orderCount = await Order.countDocuments();
      
      if (!orderCount) {
          res.status(500).json({ success: false });
      }

      res.send({
          orderCount: orderCount
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/get/userorders/:userid', async (req, res) => {
  const userOrderList = await Order.find({user: req.params.userid}).populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' }}).sort({'dateOrdered': -1});

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});


module.exports = router;










// {
//     "orderItems":[
//         {
//             "quantity":3,
//             "product":"658d2d911485914eb61ae86"
//         },
//         {
//             "quantity":2,
//             "product":"658e7872568f4fd5406b6af0"
//         }
//     ],
//     "shippingAddress1":"floer street,86",
//     "shippingAddress2":"1-H",
//     "city":"zoma",
//     "zip":"00000",
//     "country":"malawi",
//     "phone":"099878787",
//     "user":"658fbfe75bd80a3fd92c96d8"


// }