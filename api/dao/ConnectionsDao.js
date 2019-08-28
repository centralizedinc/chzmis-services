"use strict";

var model = require('../models/ConnectionsModel');
var mongoose = require('mongoose')

class ConnectionsDao {

    /**
     * @returns {Promise}
     */
    static findAll() {
        return model.find({
            status: 1
        }).lean().exec()
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
     * @param {String} user_id 
     */
    static findOneInMember(user_id) {
        return model.find({
            "members.account_id": user_id,
            status: 1
        }).lean().exec()
    }

    /**
     * @returns {Promise}
     * @param {String} id 
     * @param {Object} updated_details 
     */
    static findOneByIdAndUpdate(id, updated_details) {
        return model.findByIdAndUpdate(id, updated_details).exec()
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
     */
    static findNameAndId() {
        return model.find({}).select("_id name members").lean().exec()
    }

    /**
     * @returns {Promise}
     */
    static connect(data) {
        return model.findByIdAndUpdate(data.connection, { $push: { members: { account_id: data.account_id, role: 0 } } }).exec()
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
     * @param {String} id 
     * @param {Object} modified_details
     */
    static modifyByID(id, modified_details) {
        return model.findByIdAndUpdate(id, modified_details).lean().exec()
    }

    /**
     * @returns {Promise}
     * @param {Object} conditions 
     * @param {Object} modified_details 
     */
    static modify(conditions, modified_details) {
        return model.findOneAndUpdate(conditions, modified_details).lean().exec()
    }
}

module.exports = ConnectionsDao