const sequelize = require("../../config/database");
const pasket = require("../models/basket");
const items = require("../models/items");
const User = require("../models/User");
const fs = require( "fs")
const { Op } = require("sequelize");


exports.create = async (req,res)=>{
    try{
        const userId = req.body.userId;
        const itemsId = req.body.itemsId;
        const quantity = req.body.quantity;
        
        
        const item = await items.findByPk(itemsId);

        if (!item ) {
          return res.send('Item not found.');
        }
        if (item.quantity<quantity){
          return res.send("no ability to serive you")
        }
        

        const result = await pasket.create({
            userId:userId,
            itemsId:itemsId,
            name:items.name,
            price:item.price,
            location:item.location,
            quantity:quantity


        })

        const theRest = item.quantity - result.quantity;

        const rest = await items.update({name:item.name,
          descrption:item.descrption,
          price:item.price,
          quantity:theRest,
          location:item.location,
          ability:item.ability,},{ where: { id: item.id }, individualHooks: true });


        return  res.send({
            success: true,
            message: "item has been added to the basket",
            details: result,
            rest:rest,
      })


    }catch(err){
       return res.send({
            success: false,
            message: err.message,
            
        })
    }

};


exports.deleteItemsById = async (req,res) =>{
    try {
      const id = [];
      const numbers = [];
      const data = req.body.data;
      const final = req.query.final; //? 0 if soft delete || 1 if final delete
      const finalAll = req.query.finalAll; //? 0 if soft delete all || 1 if final delete all the deleted softly
  
      if (finalAll != 0 && finalAll != 1) {
        data.map((item) => {
          numbers.push(item.name)
          id.push(item.id)
        })
      }
  
      if (finalAll == 0) {
        const result = await items.destroy({ truncate: true });
        if (result > 0) {
          
  
          res.send({
            success: true,
            message: `All items has been deleted successfully!`,
          });
        } else {
          
          res.send({
            message: `Cannot delete All items .Maybe items don't exists!`,
            success: false,
          });
        }
      } else if (finalAll == 1) {
        const deletedItems = await items.findAll({
          where: { deletedAt: { [Op.ne]: null } },
          paranoid: false,
        });
  
        const result = await items.destroy({
          where: { deletedAt: { [Op.ne]: null } },
          force: true,
        });
  
        if (result > 0) {
          deletedItems.map(async (item) => {
            const dir1 = `./public/assets/images/items/${item.id}`;
            if (fs.existsSync(dir1)) {
              fs.rmSync(dir1, { recursive: true });
            }
          })
         
          res.send({
            success: true,
            message: `All items has been deleted successfully!`,
          });
        } else {
         
          res.send({
            message: `Cannot delete all items .Maybe items don't exists!`,
            success: false,
          });
        }
      } else {
        if (final == 0) {
          const result = await items.destroy({ where: { id: id } });
          if (result > 0) {
           
            res.send({
              success: true,
              message: `items with number=${numbers} has been deleted successfully!`,
            });
          } else {
          
            res.send({
              message: `Cannot delete items with number=${numbers}. Maybe items doesn't exists!`,
              success: false,
            });
          }
        } else if (final == 1) {
  
          const result = await items.destroy({
            where: {
              id: id,
              deletedAt: { [Op.ne]: null },
            },
            force: true,
          });
  
  
          if (result > 0) {
            id.map((id) => {
              const dir1 = `./public/assets/images/bajes/${id}`;
              if (fs.existsSync(dir1)) {
                fs.rmSync(dir1, { recursive: true });
              }
  
            });
           
            res.send({
              success: true,
              message: `items with name=${numbers} has been deleted successfully!`,
            });
          } else {
           
            res.send({
              message: `Cannot delete items with number=${numbers}. Maybe items doesn't exist!`,
              success: false,
            });
          }
        }
      }
    } catch (err) {
   
      res.send({
        success: false,
        message: err.message,
      });
    }
  };





