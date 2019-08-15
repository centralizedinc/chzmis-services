"use strict";

var model = require('../models/CommentsActivitiesModel');

class CommentsActivitiesDao {

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
     * @param {String} author 
     * @param {String} parent_id
     */
    static findAll(author, parent_id) {
        return model.find({
            author: author,
            parent_id: parent_id
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

module.exports = CommentsActivitiesDao