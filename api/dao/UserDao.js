"use strict";

var model = require('../models/UserModel');
const bcrypt = require('bcrypt-nodejs')

class UserDao {

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
     * @param {String} account_id 
     */
    static findOneByAccountID(account_id) {
        return model.findById(account_id).lean().exec()
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
        console.log("details doa: " + JSON.stringify(details))
        return (new model(details)).save()
    }

    /**
     * @returns {Promise}
     * @param {String} id 
     * @param {Object} details 
     */
    static updateProfileById(id, details) {
        return model.findByIdAndUpdate(id, details).exec()
    }
}

module.exports = UserDao