// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;

// Require seed to reset database before each test
const utils = require('../../lib/utils');

// The file to be tested
var reports = require('../../routes/reports');

// Reports testing block
describe('Reports', function() {
  beforeEach(function() {
    return utils.reportSeed();
  });
  describe('getReports()', function() {
    xit('should successfully generate a CSV report of all students and their stats', function(done) {
      // NOTE: the third column is intentionally left empty, as per request from Alicia
      var expectedCSV = {
        report: 'Player: Player Name, Data Entry Group: Data Entry Group Name, Player Data ID, PRE-Measurement Date, ' +
        'PRE-Height (in), PRE-Weight (lbs), PRE-PACER Score, POST-Measurement Date, POST-Height (in), ' +
        'POST-Weight (lbs), POST-PACER Score\n' +
        'Annabeth Chase, LMElementaryBoys, , 05/19/2016, 55, 56, 57, 12/02/2016, 40, 12, 500\n' +
        'Brian Smith, YawkeyGirls, , 05/18/2016, 44, 16, 50, 05/19/2016, 45, 18, 421\n' +
        'Percy Jackson, LMElementaryBoys, , 05/19/2016, 7, 7, null, 05/19/2016, 7, 7, 7\n'
      };
      var promise = reports.getReports({});

      promise.then(function(data) {
        assert.deepEqual(data, expectedCSV);
        done();
      });
    });
  });

  describe('getReportByProgram(req)', function() {
    it('should successfully generate a CSV report of students and their stats', function(done) {
        // NOTE: the third column is intentionally left empty, as per request from Alicia
      var expectedCSV = {
        report: 'Player: Player Name, Data Entry Group: Data Entry Group Name, Player Data ID, PRE-Measurement Date, ' +
        'PRE-Height (in), PRE-Weight (lbs), PRE-PACER Score, POST-Measurement Date, POST-Height (in), ' +
        'POST-Weight (lbs), POST-PACER Score\n' +
        'Brian Smith, YawkeyGirls, , 05/18/2016, 44, 16, 50, 05/19/2016, 45, 18, 421\n'
      };

      var req = {
        params: {
          program_id: 2
        }
      };

      var promise = reports.getReportByProgram(req);

      promise.then(function(data) {
        assert.deepEqual(data, expectedCSV);
        done();
      });
    });

    it('should successfully generate a CSV report of students and their stats 2', function(done) {
      var expectedCSV = {
        report: 'Player: Player Name, Data Entry Group: Data Entry Group Name, Player Data ID, PRE-Measurement Date, ' +
        'PRE-Height (in), PRE-Weight (lbs), PRE-PACER Score, POST-Measurement Date, POST-Height (in), ' +
        'POST-Weight (lbs), POST-PACER Score\n' +
        'Annabeth Chase, LMElementaryBoys, , 05/19/2016, 55, 56, 57, 12/02/2016, 40, 12, 500\n' +
        'Percy Jackson, LMElementaryBoys, , 05/19/2016, 5, 5, 5, 12/02/2016, 7, 7, 7\n'
      };

      var req = {
        params: {
          program_id: 1
        }
      };

      var promise = reports.getReportByProgram(req);

      promise.then(function(data) {
        assert.deepEqual(data, expectedCSV);
        done();
      });
    });

    xit('should return error if given program_id is not an int', function(done) {
      var req = {
        params: {
          program_id: 'hi'
        }
      };

      var promise = reports.getReportByProgram(req);

      promise.catch(function(err) {
        assert.equal(err.message, 'Given program_id is not a valid input');
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should return empty if given program_id is not in the database', function(done) {
      var req = {
        params: {
          program_id: 3921893
        }
      };

      var promise = reports.getReportByProgram(req);

      promise.then(function(data) {
        assert.deepEqual(data, []);
        done();
      });
    });
  });
});
