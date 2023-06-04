const bcrypt = require("bcryptjs");
const sequelize = require("../../config/database");
const { sendToken } = require("../middlewares/sendToken");
const User = require("../models/User");

const { Op } = require("sequelize");

const fs = require("fs");


//? register user done with logger
exports.register = async (req, res) => {
  try {
    const username = await User.findOne({
      where: { name: req.body.username },
    });
    if (username) {
      return res.json({
        success: false,
        message: "Username already exists",
      });
    }
    const email = await User.findOne({ where: { email: req.body.email } });
    if (email)
      return res.json({
        success: false,
        message: "Email already exists",
      });
    //Hash passwords
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
   
    const user = new User({
      
      name: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      phone: req.body.phone,
      online: req.body.status,
      location: req.body.location,
      governorate: req.body.governorate,
      
    });

    const result = await user.save();

   

    res.send({
      success: true,
      message: `User ${result.name} created`,
    });
  } catch (err) {
    // ! Error Logger send message : error and send User id for join
    res.send({
      success: false,
      message: err.message,
    });
  }
};

//? login user done with logger
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { name: req.body.username }
     
    });
    if (!user) {
      return res.send({
        success: false,
        message: "Invalid Username!",
      });
    }

    /**
     * ? this login method with jwt one way hashing
     * @param req.body.password compare with @param user.password from db
     */

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.send({ success: false, message: "Invalid Password!" });
    }

    //! create Jwt token
    sendToken(req, res, user);
    

  } catch (err) {
  
    res.send({ success: false, message: err.message });
  }
};

// ? this function create Admin on start server and connection with DB
// ? create admin done
exports.createAdmin = async () => {
  try {
    await sequelize
      .transaction(async (t) => {
        const username = await User.findOne({
          where: { username: "admin" },
        });
        if (username) {
          return;
        }
        const email = await User.findOne({ where: { email: "admin@iq" } });
        if (email) return;

        //Hash passwords
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, saltRounds);

       

       

        await User.create(
          {
            fullname: "admin",
            username: process.env.ADMIN_USERNAME,
            password: hashedPassword,
            email: "admin@programming.com",
            phone: "077",
            // avatar: 'default.png',
            UserRoleId: role.id,
          },
          { transaction: t }
        );

        return "Admin created";
      })
      .catch((err) => {
        return `failed ${err}`;
      });
  } catch (err) {
  
    console.log(err);
  }
};

//* logout user done || Logger done
exports.logout = (req, res) => {

  req.session.destroy(async (err) => {
    if (err) {
   
      throw err;
    }
    // const updateUser =await User.update({ active: 0 }, { where: { id: id } })
    

    res.json({
      success: true,
      message: "logout",
    });
  });
};

//* update user done with logger
exports.UpdateUserById = async (req, res) => {
  try {
    let id;
    if (req.query.supId == undefined) { throw new Error("send subId (Type : uuid) first") }
    else {
      id = req.query.supId;
      const saltRounds = await bcrypt.genSalt(10);
      const password =
        req.body.password === undefined
          ? undefined
          : await bcrypt.hash(req.body.password, saltRounds);
      const governorate =
        req.body.governorate === undefined ? undefined : req.body.governorate;
      const name =
        req.body.username === undefined ? undefined : req.body.username;
      const email = req.body.email === undefined ? undefined : req.body.email;
      const phone = req.body.phone === undefined ? undefined : req.body.phone;
      const online = req.body.status === undefined ? undefined : req.body.status;
      const location = req.body.location === undefined ? undefined : req.body.location;
    



      const result = await User.update(
        {
          governorate: governorate,
          name: name,
          password: password,
          email: email,
          phone: phone,
          online: online,
          location: location,
         
        },
        { where: { id: id }, individualHooks: true }
      );

      const user = result[1][0];

      if (result[0] > 0) {
       
       
        res.send({
          success: true,
          message: `User ${user.dataValues.username} updated `,
        });
      } else {
       
        res.send({
          success: false,
          message: `Cannot update User with id= ${id} .Maybe User was not found or req.body is empty!`,
        });
      }
    }
  } catch (err) {
    
    
   
  
    res.send({
      success: false,
      message: err.errors
        ? err.errors.map((item) => item.message)
        : [err.message],
    });
  }
};

//* get user by id done || Logger done
exports.getUserById = async (req, res, next) => {
  try {
    const id = req.query.userId;
    // console.log(id)
    const user = await User.findOne({
      where: { id: id }
      
      
    });
    if (user === null) {
      res.send({
        success: false,
        message: "user not found!"
      });
    } else {
      res.send({
        success: true,
        message: "user info",
        user,
      });
    }
    // console.log(user)

  } catch (err) {
   
    res.send({
      success: false,
      message: err.message,
    });
  }
};

//* delete user by id done || Logger done
exports.deleteUserById = async (req, res) => {
  try {
    const id = req.body.userId;
    const names = req.body.names;

    const result = await User.destroy({ where: { id: id } });

    if (result > 0) {
      

      res.send({
        success: true,
        message: `User with names=[${names}] was deleted successfully!`,
      });
    } else {
     
      res.send({
        message: `Cannot delete User with names=[${names}] . Maybe User was not found!`,
        success: false,
      });
    }
  } catch (err) {
    
    res.send({
      success: false,
      message: err.message,
    });
  }
};

//* get all Users done || Logger done
exports.getAllUsers = async (req, res) => {
  try {
    const whereSearch =
      req.query.search == null ? "%%" : `%${req.query.search}%`;
    const options = {
      page: req.query.page ? parseInt(req.query.page) : 1, // Default 1
      paginate: req.query.paginate ? parseInt(req.query.paginate) : 25, // Default 25
      where: {
        name: { [Op.not]: req.user.username },

        [Op.or]: [
          {
            governorate: { [Op.like]: whereSearch },
          },
          {
           name: { [Op.like]: whereSearch },
          },
        ],
      },
      
      paranoid: false,
    };
    const users = await User.paginate(options);


    // whereSearch != undefined ? loggerSys: null
    res.send({
      success: true,
      message: "user info",
      users,
    });
  } catch (err) {
  
    res.send({
      success: false,
      message: err.message,
    });
  }
};
