"use strict";

var model = require('../models/AccountsModel');
const bcrypt = require('bcrypt-nodejs')

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

    /**
     * @returns {Promise}
     * @param {String} google_id 
     */
    static findByGoogleID(google_id) {
        return model.findOne({
            google_id
        }).lean().exec()
    }

    /**
     * @returns {Promise}
     * @param {Object} conditions 
     */
    static find(conditions) {
        return model.find(conditions).lean().exec()
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