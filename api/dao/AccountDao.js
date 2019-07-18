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
     * @param {Object} conditions 
     */
    static findOne(conditions) {
        return model.findOne(conditions).lean().exec()
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
        return (new model(details)).save()
    }

    /**
     * @returns {Promise}
     * @param {String} email 
     * @param {String} new_password 
     */
    static updatePasswordEmail(email, new_password) {
        const password = bcrypt.hashSync(new_password, 10);
        return model.findOneAndUpdate({ email }, { password }).exec()
    }

    /**
     * @returns {Promise}
     * @param {String} email 
     * @param {String} session_token 
     */
    static saveSession(email, session_token) {
        return model.findOneAndUpdate({ email }, { session_token }).exec()
    }
}

module.exports = AccountDao