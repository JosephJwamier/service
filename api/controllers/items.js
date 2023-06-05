const sequelize = require("../../config/database");
const items = require("../models/items");
const User = require("../models/User");
const fs = require( "fs")
const { Op } = require("sequelize");


exports.create = async (req,res)=>{
    try{
        const name = req.body.name;
        const price = req.body.price;
   
        if (!name || !price){
            return res.send("please inter the items name and price");
        }

        const result = await items.create(req.body)

        res.send({
            success: true,
            message: "item has been added",
            details: result,
        })


    }catch(err){
        res.send({
            success: false,
            message: err.message,
            
        })
    }

};


exports.updateById = async (req,res)=>{
    try{
        const id = req.query.id;
        
        if(!id){
            return res.send ("enter id in the req")
        }

        const name = req.body.name == undefined ? undefined : req.body.name;
        const descrption = req.body.descrption == undefined ? undefined : req.body.descrption;
        const price = req.body.price == undefined ? undefined : req.body.price;
        const location = req.body.location == undefined ? undefined : req.body.location;
        const ability = req.body.ability == undefined ? undefined : req.body.ability;

        const result = await items.update({
            name:name,
            descrption:descrption,
            price:price,
            location:location,
            ability:ability,
        });

        if(result[0]>0){
            return res.send(
                {
                    success: true,
                    message: "item has been update",
                    details: result,   
                }
            )
        }

    }catch(err){

    }
}


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





