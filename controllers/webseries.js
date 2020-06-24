const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const WebSeries = require('../models/webseries');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.webseriesById = (req, res, next, id) => {
    WebSeries.findById(id)
    .exec((err, webseries)=>{
        if(err || !webseries) {
            return res.status(400).json({
                error:"webseries not found"
            });
        } 
        req.webseries = webseries;
        next();
    });
};

exports.read = (req, res)=>{
    req.webseries.photo = undefined;
    return res.json(req.webseries);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        //check for all fields
         const { name, description, rating, trailer, link , category, episodes, tag, zip} = fields;

         if(!name || !description || !rating || !trailer || !link || !category || !episodes || !tag || !zip ){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }


        let webseries = new WebSeries({name, description, rating, trailer, category, episodes, tag, link, zip});

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            webseries.photo.data = fs.readFileSync(files.photo.path);
            webseries.photo.contentType = files.photo.type
        }

        webseries.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.remove = (req,res) => {
    let webseries = req.webseries;
    webseries.remove((err, removedWebSeries)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            removedWebSeries,
            message: 'Webseries deleted Successfully'
        });
    });
};


exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let webseries = req.webseries
        webseries = _.extend(webseries, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            webseries.photo.data = fs.readFileSync(files.photo.path);
            webseries.photo.contentType = files.photo.type
        }
        webseries.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "desc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;
   WebSeries.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((error, movies) => {
            if(error){
                return res.status(400).json({
                    error: 'Movies not found'
                });
            }
            res.json(movies);
        });
 };


exports.photo = (req, res, next) => {
    if(req.webseries.photo.data){
        res.set('Content-Type', req.webseries.photo.contentType);
        return res.send(req.webseries.photo.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    //create query object to hold search value and category value
    const query = {};
    //assign search value to query.name
    if(req.query.search) {
        query.name = {$regex: req.query.search, $options:'i'};
        //assign category value to query.category
        if(req.query.category && req.query.category !== 'All') {
            query.category =req.query.category
        }
        //find the movie based on query object with 2 properties
        //search and category
        WebSeries.find(query, (err, webseries) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(webseries);
        })
        .populate('category')
        .select('-photo')
    }

};

exports.listBySearch = (req, res) => {
let order = req.body.order ? req.body.order : "desc";
let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
let limit = req.body.limit ? parseInt(req.body.limit) : 100;
let skip = parseInt(req.body.skip);
let findArgs = {};

// console.log(order, sortBy, limit, skip, req.body.filters);
// console.log("findArgs", findArgs);

for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
        if (key === "price") {
            // gte -  greater than price [0-10]
            // lte - less than
            findArgs[key] = {
                $gte: req.body.filters[key][0],
                $lte: req.body.filters[key][1]
            };
        } else {
            findArgs[key] = req.body.filters[key];
        }
    }
}

WebSeries.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Movies not found"
            });
        }
        res.json({
            size: data.length,
            data
        });
    });
};
