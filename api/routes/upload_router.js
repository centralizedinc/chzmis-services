var router = require("express").Router();

const jwt = require("jsonwebtoken");

var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('UPLOAD')

var Uploader = require('../utils/uploader')


router.route('/')
    .post((req, res) => {
        const upload = Uploader.uploadDocuments(req.query.account_id, req.query.directory);
        upload(req, res, function (err, some) {
            response_helper.sendPostResponse(req, res, req.files, err, 0)
        })
    })
// .delete((req, res)=>{
//     Uploader.deleteDocuments(req.body.keys)
//     .then(result=>{
//         response_helper.sendPostResponse(req, res, result, null, 0);
//     })
//     .catch(err=>{
//         response_helper.sendPostResponse(req, res, null, err, 0);
//     })
// })

router.route('/avatar/:account_id')
    .post((req, res) => {
        const singleUpload = Uploader.uploadAvatar(req.params.account_id);
        singleUpload(req, res, function (err, some) {
            response_helper.sendPostResponse(req, res, req.file, err, 1)
        })
    })
// .delete((req, res) => {
//     key = req.body.key;
//     Uploader.deleteAvatar(key)
//         .then(result => {
//             response_helper.sendPostResponse(req, res, result, null, 1);
//         })
//         .catch(err => {
//             response_helper.sendPostResponse(req, res, null, err, 1);
//         })
// })

router.route('/post/:account_id')
    .post((req, res) => {
        const upload = Uploader.uploadDocuments(req.params.account_id, "posts");
        upload(req, res, function (err, some) {
            response_helper.sendPostResponse(req, res, req.files, err, 2)
        })
    })

router.route('/comment/:account_id')
    .post((req, res) => {
        const upload = Uploader.uploadDocuments(req.params.account_id, "comments");
        upload(req, res, function (err, some) {
            response_helper.sendPostResponse(req, res, req.files, err, 3)
        })
    })

module.exports = router;