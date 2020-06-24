const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Request = require('../models/request');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.requestById = (req, res, next, id) => {
    Request.findById(id)
    .exec((err, request)=>{
        if(err || !request) {
            return res.status(400).json({
                error:"request not found"
            });
        } 
        req.request = request;
        next();
    });
};

exports.read = (req, res)=>{
    return res.json(req.request);
};

exports.create = (req, res) => {
    const request = new Request(req.body);
    request.save(async(error , request) => {
        if(error) {
            return res.status(400).json({
                error:errorHandler(error)
            });
        }
        await res.json(request);
    });
};

exports.remove = (req,res) => {
    let request = req.request;
    request.remove(async(err, deletedRequest)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
      await res.json({
            deletedRequest,
            message: 'Request deleted Successfully'
        });
    });
};

exports.update = (req, res) => {
    Request.findOneAndUpdate(
        { _id: req.request._id }, 
        { $set: req.body }, 
        { new:true },
        async(error, request) => {
            if(error) {
                return res.status(400).json({
                    error: 'Failed to update request'
                });
            }
            await res.json(request);
        }
        );
    
};

exports.list = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 1000;
    Request.find()
         .limit(limit)
         .exec((error, requests) => {
             if(error){
                 return res.status(400).json({
                     error: 'requests not found'
                 });
             }
             res.json(requests);
         });
 };



