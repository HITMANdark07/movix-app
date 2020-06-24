const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
    .exec((err, category)=>{
        if(err || !category) {
            return res.status(400).json({
                error:"category not found"
            });
        } 
        req.category = category;
        next();
    });
};

exports.read = (req, res)=>{
    return res.json(req.category);
};

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save(async(error , category) => {
        if(error) {
            return res.status(400).json({
                error:errorHandler(error)
            });
        }
        await res.json(category);
    });
};

exports.remove = (req,res) => {
    let category = req.category;
    category.remove(async(err, deletedCategory)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
      await res.json({
            deletedCategory,
            message: 'Category deleted Successfully'
        });
    });
};

exports.update = (req, res) => {
    Category.findOneAndUpdate(
        { _id: req.category._id }, 
        { $set: req.body }, 
        { new:true },
        async(error, category) => {
            if(error) {
                return res.status(400).json({
                    error: 'Failed to update category'
                });
            }
            await res.json(category);
        }
        );
    
};

exports.list = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 20;
    Category.find()
         .limit(limit)
         .exec((error, categories) => {
             if(error){
                 return res.status(400).json({
                     error: 'Categories not found'
                 });
             }
             res.json(categories);
         });
 };



