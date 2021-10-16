const User = require("../models/user");
const Order = require("../models/order");
const product = require("../models/product");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user"
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this account"
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaceList=(req,res, next) => {
let purchace=[]
req.body.order.products.forEach(products => {
  purchace.push({
    _id:product._id,
    name:product.name,
    decription:product.decription,
    category:product.category,
    quantity:product.quantity,
    amount:req.body.order.amount,
    transcation_id:req.body.order.transcation_id,

  });
});

//store in DB
User.findOneAndUpdate(
  {_id:req.profile._id},
  {$push:{purchases:purchases}},
  {new:true},
  (err,purchases) =>{
    if(err){
      return res.status(400).json({
        error:"Unable to save in db",
      })
    }
    next();
  }
)
};
