const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Movie = require('../models/movie');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.movieById = (req, res, next, id) => {
    Movie.findById(id)
    .exec((err, movie)=>{
        if(err || !movie) {
            return res.status(400).json({
                error:"movie not found"
            });
        } 
        req.movie = movie;
        next();
    });
};

exports.read = (req, res)=>{
    req.movie.photo = undefined;
    return res.json(req.movie);
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
         const { name, description, rating, trailer, link, category, running, tag} = fields;

         if(!name || !description || !rating || !trailer || !link || !category || !running || !tag ){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }



        let movie = new Movie(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            movie.photo.data = fs.readFileSync(files.photo.path);
            movie.photo.contentType = files.photo.type
        }

        movie.save((err, result)=>{
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
    let movie = req.movie;
    movie.remove((err, removedMovie)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            removedMovie,
            message: 'Movie deleted Successfully'
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

        let movie = req.movie
        movie = _.extend(movie, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            movie.photo.data = fs.readFileSync(files.photo.path);
            movie.photo.contentType = files.photo.type
        }
        movie.save((err, result)=>{
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
     let order = req.query.order ? req.query.order : "asc";
     let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
     let limit = req.query.limit ? parseInt(req.query.limit) : 16;
    Movie.find()
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
    if(req.movie.photo.data){
        res.set('Content-Type', req.movie.photo.contentType);
        return res.send(req.movie.photo.data);
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
        Movie.find(query, (err, movies) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(movies);
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
        findArgs[key] = req.body.filters[key];
    }
}

Movie.find(findArgs)
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
