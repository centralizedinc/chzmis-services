"use strict";

var ApplicationSettings = require('./ApplicationSettings');
// var jwt = require("jsonwebtoken");

const GET = "00";
const POST = "01";
var routers = require('./constant_helper').response_routers

class ResponseHelper {
    constructor(code){
        this.router_code = routers[Object.keys(routers).find(x => x === code)];
    }

    sendResponse(req, res, model, err, route_code, name) {
        console.log(
            "################## Route Response ##################" +
            "\nNAME: " + name +
            "\nROUTER CODE: " + route_code +
            "\nERRORS: " + err +
            "\nMODEL: " + JSON.stringify(model) +
            "\n##################****************##################")
    
    
        if (err) { // Errors
            if (err.code === 11000) { // Unique Fields
                res.status(200).json({
                    success: false,
                    code: route_code,
                    message: name + " already exist !",
                    errors: [{
                        field: name,
                        message: name + " already exist !"
                    }]
                })
            } else if (err.errors) { // Required Fields 
                var error_fields = Object.keys(err.errors);
                var errors = [];
                error_fields.forEach(field => {
                    errors.push({
                        message: err.errors[field].message,
                        field: field
                    })
                });
                console.log('########## error_fields :', JSON.stringify(errors));
                res.status(200).json({
                    success: false,
                    code: route_code,
                    message: "Validation Error",
                    errors: errors
                })
            } else if (err.local_errors) { // Computed Fields
                res.status(200).json({
                    success: false,
                    code: route_code,
                    message: "Validation Error",
                    errors: err.local_errors
                });
            } else { // Internal Server Error
                res.status(500).json(err)
            }
        } else {
            if (model) { // Success
                res.status(200).json({
                    success: true,
                    code: route_code,
                    message: ApplicationSettings.getValue('SUCCESS_RESPONSE_MESSAGE'),
                    model: model
                });
            } else {
                res.status(200).json({
                    success: true,
                    code: route_code,
                    message: "No data found.",
                    model: model
                });
            }
        }
    }
    
    sendGetResponse(req, res, model, err, index) {
        this.sendResponse(req, res, model, err, this.router_code.code + index.toString() + GET, this.router_code.name);
    }
    
    sendPostResponse(req, res, model, err, index) {
        this.sendResponse(req, res, model, err, this.router_code.code + index.toString() + POST, this.router_code.name);
    }
    
    sendExpirationResponse(res, code, token, err) {
        console.log(
            "################## Route Response ##################" +
            "\nCODE: " + code +
            "\nTOKEN: " + token +
            "\nERROR: " + JSON.stringify(err) +
            "\n##################****************##################")
        if (typeof err === 'string') {
            err = JSON.parse(err)
        }
    
        if (code === 'MULTIPLE_SESSION') {
            res.status(401).json({
                success: false,
                code: code,
                icons: "add_alert",
                errors: [{
                    field: "",
                    message: "Multiple Session is not allowed",
                    icons: "add_alert"
                }]
            })
        } else {
            res.status(401).json({
                success: false,
                code: code,
                errors: [{
                    field: "",
                    message: "Invalid Token/Session is already expired. Please re-login"
                }]
            })
        }
    }
}

module.exports = ResponseHelper