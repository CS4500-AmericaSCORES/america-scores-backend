// Set the env to development
process.env.NODE_ENV = 'development';

// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;

// Require seed to reset database before each test
const seed = require('../../lib/utils').seed;

// The file to be tested
const stats = require('../../routes/stats');

// Create fake stats
var fakeStat = {
  stat_id: 1,
  student_id: 1,
  event_id: 1,
  height: 5,
  weight: 5,
  pacer: 5
};

var fakeStat2 = {
  stat_id: 2,
  student_id: 1,
  event_id: 2,
  height: 7,
  weight: 7,
  pacer: 7
};

var fakeStat3 = {
  stat_id: 3,
  student_id: 2,
  event_id: 6,
  height: 71,
  weight: 17,
  pacer: 57
};

var fakeStat4 = {
  stat_id: 4,
  student_id: 2,
  event_id: 4,
  height: 40,
  weight: 12,
  pacer: 500
};

var fakeStat5 = {
  stat_id: 5,
  student_id: 2,
  event_id: 2,
  height: 44,
  weight: 16,
  pacer: 500
};

var fakeStat6 = {
  stat_id: 6,
  student_id: 4,
  event_id: 2,
  height: 4,
  weight: 12,
  pacer: 421
};

// This stat is added later
var fakeStat7 = {
  stat_id: 7,
  student_id: 2,
  event_id: 2,
  height: 320,
  weight: 54,
  pacer: 382,
};

// Update Checking
var fakeStat8 = {
  stat_id: 1,
  student_id: 1,
  event_id: 1,
  height: 6,
  weight: 6,
  pacer: 6
};

// Add before each to reset database between tests
beforeEach(function() {
  return seed();
});

describe('stats', function() {
  describe('getStats(req)', function() {
    xit('should get all the stats in the database', function(done) {
      // GET all doesn't need anything from the request, so pass in empty
      var promise = stats.getStats({});

      // When the promised data is returned, check it against the expected data
      promise.then(function(data) {
        assert.deepEqual([fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6], data);
        done();
      });
    });

    // Get all stats at one site
    xit('should get all stats for one site', function(done) {
      var req = {
        params: {
          site_id: 1
        }
      };

      var promise = stats.getStats(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat, fakeStat4]);
        done();
      });
    });

    // test for site_id not in database
    xit('should return empty array if the site_id is not in database',
    function(done) {
      var req = {
        params: {
          site_id: 44555555
        }
      };

      var promise = stats.getStats(req);
      promise.then(function(data) {
        assert.deepEqual(data, []);
        done();
      });
    });

    xit('should give an error if the site_id is negative',
    function(done) {
      var req = {
        params: {
          site_id: -4
        }
      };

      var promise = stats.getStats(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given site_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'site_id');
        assert.equal(err.propertyValue, req.params.site_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    // test for error if site_id not an integer
    xit('should give an error if the stat_id is not an integer',
    function(done) {
      var req = {
        params: {
          site_id: 'hi'
        }
      };

      var promise = stats.getStats(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given site_id is of invalid format (e.g. not an integer or' +
        ' negative)');
        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'site_id');
        assert.equal(err.propertyValue, req.params.site_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    // Get all stats of one student
    xit('should get all stats for one student', function(done) {
      var req = {
        params: {
          student_id: 1
        }
      };

      var promise = stats.getStats(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat, fakeStat2]);
        done();
      });
    });

    // test for student_id not in database
    xit('should return empty array if the student_id is not in the database',
    function(done) {
      var req = {
        params: {
          student_id: 48394234
        }
      };

      var promise = stats.getStats(req);
      promise.then(function(data) {
        assert.deepEqual(data, []);
        done();
      });
    });

    xit('should give an error if the student_id is negative',
    function(done) {
      var req = {
        params: {
          student_id: -12
        }
      };

      var promise = stats.getStats(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given student_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    // test for error if student_id not an integer
    xit('should give an error if the student_id is not an integer',
    function(done) {
      var req = {
        params: {
          student_id: 'bob'
        }
      };

      var promise = stats.getStats(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given student_id is of invalid format (e.g. not an integer or' +
        ' negative)');
        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 400);
        done();
      });
    });
  });

  describe('getStat(req)', function() {
    xit('should get a specific stat', function(done) {
      var req = {
        params: {
          // The student_id is contained in the request
          stat_id: 4
        }
      };

      var promise = stats.getStat(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat4]);
        assert.length(data, 1);
        done();
      });
    });

    xit('should give an error if the stat_id is negative',
    function(done) {
      var req = {
        params: {
          stat_id: -5
        }
      };

      var promise = stats.getStat(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given stat_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'stat_id');
        assert.equal(err.propertyValue, req.params.stat_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    xit('should give an error if the stat_id is not an integer',
    function(done) {
      var req = {
        params: {
          stat_id: 'that stat'
        }
      };

      var promise = stats.getStat(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given stat_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'stat_id');
        assert.equal(err.propertyValue, req.params.stat_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    xit('should give an error if the stat_id is not in the database',
    function(done) {
      var req = {
        params: {
          stat_id: 9999999
        }
      };

      var promise = stats.getStat(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given stat_id is not found in the database');
        assert.equal(err.status, 404);
        done();
      });
    });
  });

  describe('createStat(req)', function() {
    // Post a new row of stats into stats database
    xit('should add new stats to the database', function(done) {
      var req = {
        param: {
          student_id: 2,
          event_id: 2,
        },
        body: {
          height: 320,
          weight: 54,
          pacer: 382,
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStat(req);
      })
      .then(function() {
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount + 1);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6, fakeStat7]);
        done();
      });
    });

    // Attempt to post existing stat
    xit('adding an existing set of stat should do nothing', function(done) {
      var req = {
        param: {
          student_id: 1,
          event_id: 1,
        },
        body: {
          height: 5,
          weight: 5,
          pacer: 5
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStat(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Unable to add student because this set of stats already exists');
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // check error is thrown if required component 'param' is missing in request
    xit('attempting to post stats with missing param will result in an error',
     function(done) {
      var req = {
        body: {
          height: 44,
          weight: 16,
          pacer: 500
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // check error is thrown if required component 'param' is missing in request
    xit('attempting to post stats with missing body will result in an error',
    function(done) {
      var req = {
        param: {
          student_id: 2,
          event_id: 2,
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function() {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // check error is thrown if required field 'student_id' is missing in request
    xit('attempting to post stats with missing params "student_id" will ' +
    'result in an error', function(done) {
      var req = {
        param: {
          event_id: 2,
        },
        body: {
          height: 44,
          weight: 16,
          pacer: 500
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // check error is thrown if required field 'event_id' is missing in request
    xit('attempting to post stats with missing params "event_id" will ' +
    'result in an error', function(done) {
      var req = {
        param: {
          student_id: 2,
        },
        body: {
          height: 44,
          weight: 16,
          pacer: 500
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // check error is thrown if required field 'pacer' is missing in request
    xit('attempting to post stats with missing field "pacer" will ' +
    'result in an error', function(done) {
      var req = {
        param: {
          student_id: 1,
          event_id: 1,
        },
        body: {
          height: 5,
          weight: 5,
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // check error is thrown if required field 'weight' is missing in request
    xit('attempting to post stats with missing field "weight" will ' +
    'result in an error', function(done) {
      var req = {
        param: {
          student_id: 1,
          event_id: 1,
        },
        body: {
          height: 5,
          pacer: 5,
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // check error is thrown if required field 'height' is missing in request
    xit('attempting to post stats with missing field "height" will ' +
    'result in an error', function(done) {
      var req = {
        param: {
          student_id: 1,
          event_id: 1,
        },
        body: {
          weight: 5,
          pacer: 5,
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // check error is thrown if required field 'event_id' is missing in request
    xit('attempting to post stats with missing field event_id will ' +
    'result in an error', function(done) {
      var req = {
        param: {
          student_id: 1,
        },
        body: {
          pacer: 5,
          height: 5,
          weight: 5,
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    xit('attempting to post stats with missing field student_id will ' +
    'result in an error', function(done) {
      var req = {
        param: {
          event_id: 1,
        },
        body: {
          pacer: 5,
          height: 5,
          weight: 5,
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.createStats(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Could not post due to missing fields');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });
  });

  describe('updateStat(req)', function() {
    // update existing stats
    xit('should update stats in the database', function(done) {
      var req = {
        param: {
          stat_id: 1,
        },
        body: {
          height: 6,
          weight: 6,
          pacer: 6,
        }
      };

      var promise = stats.getStats({});
      var oldDB;
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        oldDB = data;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.updateStat(req);
      })
      .then(function() {
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.notDeepEqual(data, oldDB);
        assert.deepEqual(data, [fakeStat8, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // update non existing stats should error
    xit('should error updating non-existing stats', function(done) {
      var req = {
        param: {
          stat_id: 99999,
        },
        body: {
          height: 6,
          weight: 6,
          pacer: 6,
        }
      };

      var promise = stats.getStats({});
      var oldDB;
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        oldDB = data;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.updateStat(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Can not update non-existing stats.');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, oldDB);
        done();
      });
    });
  });

  describe('deleteStat(req)', function() {
    // delete existing stats
    xit('should delete stats in the database', function(done) {
      var req = {
        param: {
          stat_id: 1
        }
      };

      var promise = stats.getStats({});
      var oldDB;
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        oldDB = data;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.deleteStat(req);
      })
      .then(function() {
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount - 1);
        assert.notDeepEqual(data, oldDB);
        assert.deepEqual(data, [fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // delete non existing stats should error
    xit('should error delete non-existing stats', function(done) {
      var req = {
        param: {
          stat_id: 99999,
        }
      };

      var promise = stats.getStats({});
      var oldDB;
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        oldDB = data;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.deleteStat(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Can not delete non-existing stats.');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, oldDB);
        done();
      });
    });

    xit('should give an error if the stat_id is negative',
    function(done) {
      var req = {
        params: {
          site_id: -4
        }
      };

      var promise = stats.deleteStat(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given stat_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'stat_id');
        assert.equal(err.propertyValue, req.params.stat_id);
        assert.equal(err.status, 400);
        done();
      });
    });
  });
});