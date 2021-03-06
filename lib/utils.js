'use strict';

const Promise = require('bluebird');
const getSqlConnection = require('../config/connection').getSqlConnection;

// const AuthError = require('./errors').AuthError;
const errors = require('./errors');
const c = require('./constants/utils');
const q = require('./constants/queries');

const format = require('string-format');
format.extend(String.prototype);

function toPaddedZeroString(num) {
  return (num >= 10 ? '' : '0') + num.toString();
}

// js dates are dumb and months 0-11 but days are 1-31
function getSqlDateString(date) {
  var month = toPaddedZeroString(date.getMonth() + 1);
  var day = toPaddedZeroString(date.getDate());

  return '{0}-{1}-{2}'.format(date.getFullYear(), month, day);
}

function getJSDate(dateString) {
  var year = parseInt(dateString.substring(0, 4));
  var month = parseInt(dateString.substring(5, 7)) - 1;
  var day = parseInt(dateString.substring(8));
  return new Date(year, month, day);
}

function makeResponse(res, promise) {
  return promise.then(function(data) {
    res.send(data);
  }, function(err) {
      res.status(500).send(err);
  });
}

function isValidDate(date) {
  date = String(date);
  var dateRegEx = /^\d{4}-\d{2}-\d{2}$/;

  return date.match(dateRegEx) != null &&
    date.substring(5, 7) > 0 && date.substring(5, 7) < 13 &&
    date.substring(8) > 0 && date.substring(8) < 31;
}

function isPositiveInteger(str) {
  var intRegex = /^\d+$/;

  return String(str).match(intRegex) != null;
}

/*
function getReqAuth0Id(req) {
  if (Object.keys(req).indexOf('auth') >= 0 && Object.keys(req.auth).indexOf('auth0_id') >= 0) {
    return req.auth.auth0_id;
  } else {
     throw new AuthError();
  }
}
*/

function getAccountType(auth0_id) {
  return query('SELECT acct_type FROM Acct WHERE auth0_id = ?', [auth0_id]).then(function(acct_types) {
    return acct_types[0].acct_type;
  });
}

function Requirement(type, name) {
  this.type = type;
  this.name = name;
}

function PotentialQuery(requirements, queryString) {
  this.requirements = requirements;
  this.queryString = queryString;
}

function makeQueryArgs(obj, reqs) {
  var queryArgs = [];
  var req;
  for (var i = 0; i < reqs.length; i++) {
    req = reqs[i];
    queryArgs[i] = obj[req.type][req.name];
  }
  return queryArgs;
}

function reqHasRequirements(obj, reqs) {
  var keys = Object.keys(obj);
  var req;
  for (var i = 0; i < reqs.length; i++) {
    req = reqs[i];
    // Check that the request has the required key (e.g. 'params' or 'body')
    if (keys.indexOf(req.type) < 0) {
      return false;
    }
    // If the req name is null, all we cared about was the key's existence
    // If it's not null, we need to make sure it exists as a key within the object identified
    // by the requirement type.
    if (req.name !== null && Object.keys(obj[req.type]).indexOf(req.name) < 0) {
      return false;
    }
  }
  return true;
}

function findMissingRequirements(obj, reqs) {
  var keys = Object.keys(obj);
  return reqs.filter(function(req) {
    return keys.indexOf(req.type) < 0 ||
      (req.name !== null && Object.keys(obj[req.type]).indexOf(req.name) < 0);
  });
}

function findEmptyRequirements(obj, reqs) {
  return reqs.filter(function(req) {
    return obj[req.type][req.name].length == 0;
  });
}

function QueryError(name, status, message) {
  this.name = name;
  this.status = status;
  this.message = message;
  this.stack = (new Error()).stack;
}
QueryError.prototype = Object.create(Error.prototype);
QueryError.prototype.constructor = QueryError;

function query(queryString, args) {
  return Promise.using(getSqlConnection(), function(connection) {
    return connection.queryAsync(queryString, args);
  });
}

function defined(value) {
  return value !== undefined && value !== null;
}

function getAccountID(auth0_id) {
  return query('SELECT * FROM Acct WHERE auth0_id = ?', [auth0_id])
  .then(function(data) {
    if (data.length === 1) {
      return data[0].acct_id;
    } else {
      return Promise.reject({status: 403, message: 'Invalid Auth0 ID'});
    }
  });
}

function getSeasonFromDateString(dateString) {
  var month = dateString.substring(5, 7);
  return month < 7 ? c.SPRING : c.FALL;
}

function getSeasonId(dateString) {
  var season = getSeasonFromDateString(dateString);
  var year = dateString.substring(0, 4);
  var inserts = [season, year];
  return query(q.SELECT_SEASON_BY_SEASON_YEAR, inserts).then(function(seasons) {
    if (seasons.length > 0) {
      return seasons[0].season_id;
    } else {
      return query(q.INSERT_SEASON, inserts).then(function(data) {
        return data.insertId;
      });
    }
  });
}

function rollback(err, logMsg, rollbackFunction) {
  console.log(logMsg);
  console.log(err.toString());
  return rollbackFunction().finally(function() {
    return errors.create500();
  });
}


module.exports = {
  makeResponse, query, QueryError,
  getAccountID, getAccountType, // getReqAuth0Id,
  isValidDate, isPositiveInteger, defined,
  PotentialQuery, Requirement, makeQueryArgs, reqHasRequirements,
  findMissingRequirements, findEmptyRequirements, getSqlDateString,
  getSeasonId, getJSDate, rollback
};
