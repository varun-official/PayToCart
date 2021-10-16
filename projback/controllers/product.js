const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");
const product = require("../models/product");

exports.getproductById = (req,res,next,id) =>{
    Product.findById(id)
    .populate("category")  //it is used to display product based on category
    .exec((err,product) => {
        if (err) {
            return res.status(400).json({
                error:"product is not found in DB",
            })
        }
        req.product=product;
        next();

    });
}

exports.createProduct = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions=true;

    form.parse(req,(err,fields,file) =>{
        if (err) {
            return res.status(400).json({
                error:"probleam with image",
            })
        }
        //destucturing the fields
        const {name,description,price,category,stock} = fields
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error:"Please include all the fields",
            })
        }

        let product = new Product(fields)

        //handel photo here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"Image size too big",
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        product.save((err,product) =>{
            if (err) {
                return res.status(400).json({
                    error:"Saving product DB filed",
                })
            }
            res.json(product);
        });
      });
};

exports.getProduct = (req,res) =>{
    req.product.photo = undefined
    return res.json(req.product)
}

//midlleware that load the photo in background so that content is viewed fast it is performance optimization
exports.photo = (req,res,next) =>{
    if (req.product.photo.data) {
        res.set("Content-Type",req.product.photo.contentType);
       return res.send(req.product.photo.data);
    }

    next();
}

exports.deleteProduct = (req,res) =>{
    const product = req.product;
    product.remove((err,deletedproduct) =>{
        if (err) {
            return res.status(400).json({
                error:"failed to delete product form db"
            })
        }
        res.json({
            message:`${deletedproduct} is deleted form DB`,
        })
    });
};

exports.updateProduct = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions=true;

    form.parse(req,(err,fields,file) =>{
        if (err) {
            return res.status(400).json({
                error:"probleam with image",
            })
        }
        
        let product = req.product;
        product = _.extend(product,fields)

        //handel photo here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"Image size too big",
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        product.save((err,product) =>{
            if (err) {
                return res.status(400).json({
                    error:"Updateing product in DB filed",
                })
            }
            res.json(product);
        });
      });
};

exports.getAllProduct = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
    if (err) {
        return res.status(400).json({
            error:"No products FOUND"
        })
    }  
    res.json(products);
 });
}

exports.getAllUniqueCategoryes = (req,res) =>{
    Product.distinct("category",{},(err,category) =>{
        if (err) {
            return res.status(400).json({
                error:"No products FOUND"
            })
        }
        res.json(category)
    });
};

//it is handled in fornt end for stack and sold updation
exports.updatestock = (req,res,next) =>{
    let myOperation = req.body.order.products.map(prod =>{
        return{
            updateOne: {
                filter:{_id:prod._id},
                update:{$inc:{stock: -prod.count,sold: +prod.count}},
            }
        }
    })
    product.bulkWrite(myOperation,{},(err,products) =>{
        if (err) {
            return res.status(400).json({
                error:"Bulk operation is filed"
            })
        }
        next();
    })
}