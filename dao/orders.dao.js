const mongoose = require('mongoose');
const Order = require('../models/orders.model');

const retrieveOrders = async (data)=>{
    try{
        let orders= await Order.find();
        return orders
    }catch(err){
        throw Error(`Error while finding orders : ${err.message}`);
    }
}
const saveOrder =async (data)=>{
    try{
        let newOrder = new Order(data);
        let order = await newOrder.save();
        return order;
    }catch(err){
        throw Error(`Error while creating order: ${err.message}`);
    }
}
const updateOrder =async (id,data)=>{
    try{
        let order= await Order.findByIdAndUpdate(id,data,{new: true});
        return order;
    }catch(err){
        throw Error(`Error while updating order: ${err.message}`);
    }

}
module.exports={ retrieveOrders ,saveOrder,updateOrder};