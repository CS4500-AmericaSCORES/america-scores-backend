'use strict';

const Promise = require('bluebird');
const query = require('../lib/utils').query;

/**
 * Gets all sites matching filter, or all sites if no filter is present.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getSites(req) {
  if (req.query && req.query.acct_id) {
    return query('SELECT site_id, site_name, site_address FROM Acct NATURAL JOIN AcctToProgram NATURAL JOIN Program NATURAL JOIN Site WHERE acct_id = ' + req.query.acct_id);
  }

  return query('SELECT * FROM Site');
}

/**
 * Creates a site.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function createSite(req) {
  if (!req.body || !req.body.site_name || !req.body.site_address) {
    return Promise.reject({
      status: 406,
      message: 'Must provide site\'s name, and address'
    });
  }

  return query('SELECT * FROM Site WHERE site_name = "' + req.body.site_name + '" AND site_address = "' + req.body.site_address + '"')
    .then(function(rows) {
      if (rows.length > 0) {
        return Promise.reject({
          status: 409,
          message: 'Unable to create site: the site is already in the database'
        });
      }

      return query('INSERT INTO Site (site_name, site_address) VALUES ("' + req.body.site_name + '", "' + req.body.site_address + '")');
    });
}

/**
 * Get a sites with given id.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getSite(req) {
  return query('SELECT * FROM Site WHERE site_id = ' + req.params.site_id);
}

/**
 * Updates a site with given id.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function updateSite(req) {
  if (!req.body || (!req.body.site_name && !req.body.site_address)) {
    return Promise.reject({
      status: 406,
      message: 'Must provide site\'s name, or address'
    });
  }

  return Promise.resolve()
    .then(function() {
      if (req.body.site_name) {
        return query('UPDATE Site SET site_name = "' + req.body.site_name + '" WHERE site_id = ' + req.params.site_id);
      }
    })
    .then(function() {
      if (req.body.site_address) {
        return query('UPDATE Site SET site_address = "' + req.body.site_address + '" WHERE site_id = ' + req.params.site_id);
      }
    });
}

/**
 * Deletes a site with given id.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function deleteSite(req) {
  return query('DELETE FROM Site WHERE site_id = ' + req.params.site_id);
}

module.exports = {
  getSites, createSite, getSite, updateSite, deleteSite
};
