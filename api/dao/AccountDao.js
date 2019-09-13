"use strict";

var model = require('../models/AccountsModel');
const bcrypt = require('bcrypt-nodejs')
const UserDao = require('../dao/UserDao');
const jwt = require('jsonwebtoken');
const ApplicationSettings = require('../utils/ApplicationSettings');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const constant_helper = require('../utils/constant_helper');

class AccountDao {

    /**
     * @returns {Promise}
     */
    static findAll() {
        return model.find({}).lean().exec()
    }

    /**
     * @returns {Promise}
     * @param {String} id 
     */
    static findOneByID(id) {
        return model.findById(id).lean().exec()
    }

    /**
     * @returns {Promise}
     * @param {Number} id 
     */
    static findOneProfile(id) {
        return model.findOneAndUpdate({
            id: id
        }, {
                status: 2
            })
    }

    /**
     * @returns {Promise}
     * @param {Object} conditions 
     */
    static findOne(conditions) {
        return model.findOne(conditions).lean().exec()
    }

    /**
     * @returns {Promise}
     * @param {String} email 
     */
    static findByEmail(email) {
        return model.findOne({
            email
        }).exec()
    }

    /**
     * @returns {Promise}
     * @param {String} facebook_id 
     */

    static findByFacebookID(facebook_id) {
        return model.findOne({
            facebook_id
        }).lean().exec()
    }

    static processFacebook(facebook_account) {

        var creation_mode = false;
        var account_id = "";
        var email = "";
        var is_authenticated = false;
        var user = {};
        var account = "";

        var auth = {
            is_authenticated: false
        }
        console.log('facebook_account :', facebook_account);

        return new Promise((resolve, reject) => {
            model.findOne({
                facebook_id: facebook_account.profile.id
            })
                .then((result) => {
                    console.log('result :', result);
                    if (!result) {
                        creation_mode = true
                        return this.create({
                            email: facebook_account.profile.emails[0].value,
                            method: facebook_account.profile.provider,
                            facebook_id: facebook_account.profile.id,
                            facebook_access_token: facebook_account.facebook_access_token
                        })
                    }
                    else {
                        console.log('ACCOUNT_ID :', result);
                        account_id = result.account_id;
                        email = result.email;
                        return true;
                    }
                })
                .then((result) => {
                    console.log('result2 :', result);
                    if (result) {
                        console.log('creation_mode :', result);
                        const token = jwt.sign({
                            account_id: account_id,
                            email: email,
                            date: new Date()
                        }, ApplicationSettings.getValue("JWT_SECRET_TOKEN"));
                        // result.token = token;
                        console.log('token :', token);
                        auth.token = token
                        return this.modifyOne({ account_id: account_id }, { session_token: token });
                    }
                })
                .then((modified_account) => {
                    console.log('modified_account :', modified_account);
                    account = modified_account
                    auth.account = modified_account;
                    if(creation_mode)  return UserDao.create({
                        account_id:auth.account.account_id,
                        avatar: profile.photos[0].value ,
                        name: {
                            first: profile.name.givenName,
                            last: profile.name.familyName
                        },
                        email:profile.emails[0].value
                    })
                    else return UserDao.findOne({ account_id: modified_account.account_id });


                })
                .then((user) => {
                    auth.user = user
                    // console.log('user :', user);
                    console.log('auth :', auth);
                    if (user) {
                        this.user = user;
                        auth.is_authenticated = true;
                    }
                    resolve(auth)
                    // return done(null, result);
                })
                .catch((err) => {
                    console.log('err :', err);
                    reject(err)
                });

        })
    }

    /**
     * @returns {Promise}
     * @param {String} google_id 
     */
    static findByGoogleID(google_id) {
        return model.findOne({
            google_id
        }).lean().exec()
    }

    static processGoogle(google_account) {

        var creation_mode = false;
        var account_id = "";
        var email = "";
        var is_authenticated = false;
        var user = {};

        console.log('google_account :', google_account);

        return new Promise((resolve, reject) => {
            model.findOne({
                google_id: google_account.profile.id
            })
                .then((result) => {
                    console.log('result :', result);
                    if (!result) {

                        return this.create({
                            email: google_account.profile.emails[0].value,
                            method: google_account.profile.provider,
                            google_id: google_account.profile.id,
                            google_access_token: google_account.google_access_token
                        })
                    }
                    else {
                        console.log('ACCOUNT_ID :', result);
                        this.account_id = result.account_id;
                        this.email = result.email;
                        return this.creation_mode = true
                    }
                })
                .then((result) => {
                    console.log('result2 :', result);
                    if (result) {
                        console.log('creation_mode :', result);
                        const token = jwt.sign({
                            account_id: this.account_id,
                            email: this.email,
                            date: new Date()
                        }, ApplicationSettings.getValue("JWT_SECRET_TOKEN"));
                        // result.token = token;
                        console.log('token :', token);
                        return this.modifyOne({ account_id: this.account_id }, { session_token: token });
                    }
                })
                .then((modified_account) => {
                    console.log('modified_account :', modified_account);
                    if (modified_account) return UserDao.findOne({ account_id: modified_account.account_id });
                    resolve(modified_account)

                })
            reject(err)
            // .catch((err) => {
            //     console.log('err :', err);
            // });

        })
    }



    /**
     * @returns {Promise}
     * @param {Object} conditions 
     */
    static find(conditions) {
        return model.find(conditions).lean().exec()
    }

    static find(conditions) {
        return new Promise((resolve, reject) => {
            model.find(conditions).lean().exec()
                .then(data => {
                    if (data != null) {

                    } else {

                    }
                })
        })
    }
    /**
     * @returns {Promise}
     * @param {Object} details 
     */
    static create(details) {
        return new Promise((resolve, reject) => {
            (new model(details)).save()
                .then((result) => {
                    const account_id = this.generateAccountId(result.auto_id);
                    return this.modifyById(result._id, { account_id })
                })
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                });
        })
    }

    static generateAccountId(auto_id) {
        return new Date().getTime().toString() + auto_id.toString()
    }

    /**
     * @returns {Promise}
     * @param {String} id 
     * @param {AccountModel} updated_account 
     */
    static modifyById(id, updated_account) {
        return model.findByIdAndUpdate(id, updated_account).exec()
    }

    /**
     * @returns {Promise}
     * @param {Object} conditions 
     * @param {AccountModel} updated_account 
     */
    static modifyOne(conditions, updated_account) {
        return model.findOneAndUpdate(conditions, updated_account).exec()
    }

    /**
     * @returns {Promise}
     * @param {String} email 
     * @param {String} new_password 
     */
    static updatePasswordEmail(email, new_password) {
        const password = bcrypt.hashSync(new_password, 10);
        return model.findOneAndUpdate({
            email
        }, {
                password
            }).exec()
    }

    /**
     * @returns {Promise}
     * @param {String} email 
     * @param {String} session_token 
     */
    static saveSession(email, session_token) {
        return model.findOneAndUpdate({
            email
        }, {
                session_token
            }).exec()
    }
}

module.exports = AccountDao