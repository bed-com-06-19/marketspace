const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item'); 

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
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

    let order = new Order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
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