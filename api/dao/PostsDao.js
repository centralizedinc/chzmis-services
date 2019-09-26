"use strict";

var model = require('../models/PostsModel');

class PostsDao {

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
     * @param {String} parent_id
     */
    static findAllByParent(parent_id) {
        return model.find({
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
     */
    static findPublic() {
        return model.find({ is_public: true }).lean().exec()
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

    /**
     * @returns {Promise}
     * @param {Date} date_created 
     * @param {Number} limit 
     */
    static findWithLimitSortDate(date_created, limit) {
        if (date_created) date_created = new Date(date_created);
        else date_created = new Date();
        if (limit) limit = parseInt(limit);
        else limit = null;

        return model.find({
            date_created: {
                $lt: date_created
            }
        }).sort({ 'date_created': -1 }).limit(limit).exec()
    }

    /**
     * @returns {Promise}
     * @param {String} parent_id
     * @param {Date} date_created 
     * @param {Number} limit 
     */
    static findWithLimitSortDateByParentId(parent_id, date_created, limit) {
        if (date_created) date_created = new Date(date_created);
        else date_created = new Date();
        if (limit) limit = parseInt(limit);
        else limit = null;

        return model.find({
            parent_id,
            date_created: {
                $lt: date_created
            }
        }).sort({ 'date_created': -1 }).limit(limit).exec()
    }

    /**
     * @returns {Promise}
     * @param {Date} date_created 
     * @param {Number} limit 
     */
    static findPublicWithLimitSortDateByParentId(date_created, limit) {
        if (date_created) date_created = new Date(date_created);
        else date_created = new Date();
        if (limit) limit = parseInt(limit);
        else limit = null;

        return model.find({
            is_public: true,
            date_created: {
                $lt: date_created
            }
        }).sort({ 'date_created': -1 }).limit(limit).exec()
    }
}

module.exports = PostsDao