'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const makeResponse = require('./lib/utils').makeResponse;
// var cors = require('cors');
const app = express();

// app.use(cors());

// Routes
const students = require('./routes/students');
const sites = require('./routes/sites');
const programs = require('./routes/programs');
const events = require('./routes/events');
const stats = require('./routes/stats');

// parse application/json and look for raw text
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

// exchange access_token for user info
app.use(function(req, res, next) {
  if (!req.hasOwnProperty('authorization')) {
    res.status(400);
    res.send('authorization field not found in request');
  }

  var options = {
    method: 'GET',
    url: 'https://asbadmin.auth0.com/userinfo',
    headers: {authorization: 'Bearer ' + req.authorization}
  };

  request(options, function(err, response, body) {
    if(err) {
      // unsure if this is how we want to throw new Error(error);
      res.status = response.status;
      res.send('Unable to retrieve user info from Auth0');
    } else {
        parsedBody = JSON.parse(body);
        req.user = parsedBody;
        if(body.has)
        next();
    }
  });
});
// app.options('*', cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', function(req, res) {
  res.status(405);
  res.send('Route not implemented');
});

// Students
app.route('/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudents(req));
  });

app.route('/students/:student_id')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudent(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, students.deleteStudent(req));
  })
  .put(function(req, res, next) {
    makeResponse(res, students.updateStudent(req));
  });

app.route('/students/:student_id/programs/:program_id')
  .put(function(req, res, next) {
    makeResponse(res, students.updateStudent(req));
  });

app.route('/programs/:program_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudentsByProgram(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, students.createStudent(req));
  });

app.route('/sites/:site_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudentsBySite(req));
  });

app.route('/events/:event_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudentsByEvent(req));
  });

// Sites
app.route('/sites')
  .get(function(req, res, next) {
    makeResponse(res, sites.getSites(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, sites.createSite(req));
  });

app.route('/accounts/:account_id/sites')
  .get(function(req, res, next) {
    makeResponse(res, sites.getSitesByAccount(req));
  });

app.route('/sites/:site_id')
  .get(function(req, res, next) {
    makeResponse(res, sites.getSite(req));
  })
  .put(function(req, res, next) {
    makeResponse(res, sites.updateSite(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, sites.deleteSite(req));
  });

// Programs
app.route('/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getPrograms(req));
  });

app.route('/programs/:program_id')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgram(req));
  })
  .put(function(req, res, next) {
    makeResponse(res, programs.updateProgram(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, programs.deleteProgram(req));
  });

app.route('/sites/:site_id/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgramsBySite(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, programs.createProgram(req));
  });

app.route('/students/:student_id/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgramsByStudent(req));
  });

app.route('/accounts/:account_id/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgramsByAccount(req));
  });

// Events
app.route('/events')
  .get(function(req, res, next) {
    makeResponse(res, events.getEvents(req));
  });

app.route('/events/:event_id')
  .get(function(req, res, next) {
    makeResponse(res, events.getEvent(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, events.deleteEvent(req));
  });

app.route('/students/:student_id/events')
  .get(function(req, res, next) {
    makeResponse(res, events.getEventsByStudent(req));
  });

app.route('/programs/:program_id/events')
  .get(function(req, res, next) {
    makeResponse(res, events.getEventsByProgram(req));
  });

app.route('/programs/:program_id/events')
  .post(function(req, res, next) {
    makeResponse(res, events.createEvent(req));
  });

// Stats
 app.route('/stats')
   .get(function(req, res, next) {
    makeResponse(res, stats.getStats(req));
  });

app.route('/sites/:site_id/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStatsBySite(req));
  });

app.route('/programs/:program_id/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStatsByProgram(req));
  });

app.route('/events/:event_id/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStatsByEvent(req));
  });

app.route('/students/:student_id/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStatsByStudent(req));
  });

app.route('/events/:event_id/stats/pacer')
  .put(function(req, res, next) {
    makeResponse(res, stats.uploadPacerStats(req));
  });

app.route('/events/:event_id/stats/bmi')
  .put(function(req, res, next) {
    makeResponse(res, stats.uploadBMIStats(req));
  });

var server = app.listen(config.server.port);
console.log('Listening on port ' + config.server.port);

module.exports = server;  // for testing
