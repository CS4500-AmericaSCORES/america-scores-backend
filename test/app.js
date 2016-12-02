'use strict';

const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const Promise = require('bluebird');
const students = require('../routes/students');
const sites = require('../routes/sites');
const programs = require('../routes/programs');
const events = require('../routes/events');


describe('app.js', function() {
  var app;

  before(function() {
    app = require('../app');
  });

  after(function() {
    app.close();
  });

  it('responds to /', function(done) {
    request(app)
      .get('/')
      .expect(405)
      .expect('Route not implemented', done);
  });

  it('404 everything else', function(done) {
    request(app)
      .get('/foo/bar')
      .expect(404, done);
  });

  describe('students endpoint', function() {
    var getStudentsStub;
    var getStudentStub;
    var deleteStudentStub;
    var updateStudentStub;
    var getStudentsByProgramStub;
    var createStudentStub;
    var getStudentsBySiteStub;
    var getStudentsByEventStub;

    before(function() {
      getStudentsStub = sinon.stub(students, 'getStudents', function() {
        return Promise.resolve('got the students');
      });
      getStudentStub = sinon.stub(students, 'getStudent', function() {
        return Promise.resolve('got the student');
      });
      deleteStudentStub = sinon.stub(students, 'deleteStudent', function() {
        return Promise.resolve('deleted the student');
      });
      updateStudentStub = sinon.stub(students, 'updateStudent', function() {
        return Promise.resolve('updated the student');
      });
      getStudentsByProgramStub = sinon.stub(students, 'getStudentsByProgram', function() {
        return Promise.resolve('got students by a program');
      });
      createStudentStub = sinon.stub(students, 'createStudent', function() {
        return Promise.resolve('created a student');
      });
      getStudentsBySiteStub = sinon.stub(students, 'getStudentsBySite', function() {
        return Promise.resolve('got students by a site');
      });
      getStudentsByEventStub = sinon.stub(students, 'getStudentsByEvent', function() {
        return Promise.resolve('got students by an event');
      });
    });

    after(function() {
      students.getStudents.restore();
      students.getStudent.restore();
      students.deleteStudent.restore();
      students.updateStudent.restore();
      students.getStudentsByProgram.restore();
      students.createStudent.restore();
      students.getStudentsBySite.restore();
      students.getStudentsByEvent.restore();
    });

    it('GET /students', function(done) {
      request(app)
        .get('/students')
        .expect('got the students', 200)
        .end(function() {
          assert.isTrue(getStudentsStub.called);
          done();
        });
    });

    it('GET /students/:students_id', function(done) {
      request(app)
        .get('/students/2')
        .expect('got the student', 200)
        .end(function() {
          assert.isTrue(getStudentStub.called);
          done();
        });
    });

    it('DELETE /students/:students_id', function(done) {
      request(app)
        .delete('/students/4')
        .expect('deleted the student', 200)
        .end(function() {
          assert.isTrue(deleteStudentStub.called);
          done();
        });
    });

    it('PUT /students/:students_id', function(done) {
      request(app)
        .put('/students/6')
        .expect('updated the student', 200)
        .end(function() {
          assert.isTrue(updateStudentStub.called);
          done();
        });
    });

    it('PUT /students/:students_id/programs/:program_id', function(done) {
      request(app)
        .put('/students/8/programs/1')
        .expect('updated the student', 200)
        .end(function() {
          assert.isTrue(updateStudentStub.called);
          done();
        });
    });

    it('GET /programs/:program_id/students', function(done) {
      request(app)
        .get('/programs/1/students')
        .expect('got students for a program', 200)
        .end(function() {
          assert.isTrue(getStudentsByProgramStub.called);
          done();
        });
    });

    it('POST /programs/:program_id/students', function(done) {
      request(app)
        .post('/programs/3/students')
        .expect('created a student', 200)
        .end(function() {
          assert.isTrue(createStudentStub.called);
          done();
        });
    });

    it('GET /sites/:site_id/students', function(done) {
      request(app)
        .get('/sites/3/students')
        .expect('got students for a site', 200)
        .end(function() {
          assert.isTrue(getStudentsBySiteStub.called);
          done();
        });
    });

    it('GET /events/:event_id/students', function(done) {
      request(app)
        .get('/events/32/students')
        .expect('got students for an event', 200)
        .end(function() {
          assert.isTrue(getStudentsByEventStub.called);
          done();
        });
    });
  });

  describe('sites endpoint', function() {
    var getSitesStub;
    var getSitesByAccountStub;
    var createSiteStub;
    var getSiteStub;
    var updateSiteStub;
    var deleteSiteStub;

    before(function() {
      getSitesStub = sinon.stub(sites, 'getSites', function() {
        return Promise.resolve('got the sites');
      });
      getSitesByAccountStub = sinon.stub(sites, 'getSitesByAccount', function() {
        return Promise.resolve('got the students for an account');
      });
      createSiteStub = sinon.stub(sites, 'createSite', function() {
        return Promise.resolve('create a site');
      });
      getSiteStub = sinon.stub(sites, 'getSite', function() {
        return Promise.resolve('got the site');
      });
      updateSiteStub = sinon.stub(sites, 'updateSite', function() {
        return Promise.resolve('updated the site');
      });
      deleteSiteStub = sinon.stub(sites, 'deleteSite', function() {
        return Promise.resolve('deleted the site');
      });
    });

    after(function() {
      sites.getSites.restore();
      sites.getSitesByAccount.restore();
      sites.createSite.restore();
      sites.getSite.restore();
      sites.updateSite.restore();
      sites.deleteSite.restore();
    });

    it('GET /sites', function(done) {
      request(app)
        .get('/sites')
        .expect('got the sites', 200)
        .end(function() {
          assert.isTrue(getSitesStub.called);
          done();
        });
    });

    it('GET /accounts/:account_id/sites', function(done) {
      request(app)
        .get('/accounts/:account_id/sites')
        .expect('got the sites for an account', 200)
        .end(function() {
          assert.isTrue(getSitesByAccountStub.called);
          done();
        });
    });

    it('POST /sites', function(done) {
      request(app)
        .post('/sites')
        .expect('created a site', 200)
        .end(function() {
          assert.isTrue(createSiteStub.called);
          done();
        });
    });

    it('GET /sites/:site_id', function(done) {
      request(app)
        .get('/sites/4')
        .expect('got the site', 200)
        .end(function() {
          assert.isTrue(getSiteStub.called);
          done();
        });
    });

    it('PUT /sites/:site_id', function(done) {
      request(app)
        .put('/sites/40')
        .expect('updated the site', 200)
        .end(function() {
          assert.isTrue(updateSiteStub.called);
          done();
        });
    });

    it('DELETE /sites/:site_id', function(done) {
      request(app)
        .delete('/sites/22')
        .expect('deleted the site', 200)
        .end(function() {
          assert.isTrue(deleteSiteStub.called);
          done();
        });
    });
  });

  describe('programs endpoint', function() {
    var getProgramsStub;
    var getProgramStub;
    var updateProgramStub;
    var deleteProgramStub;
    var getProgramsBySiteStub;
    var createProgramStub;
    var getProgramsByStudentStub;
    var getProgramsByAccountStub;

    before(function() {
      getProgramsStub = sinon.stub(programs, 'getPrograms', function() {
        return Promise.resolve('got the programs');
      });
      getProgramStub = sinon.stub(programs, 'getProgram', function() {
        return Promise.resolve('got the program');
      });
      updateProgramStub = sinon.stub(programs, 'updateProgram', function() {
        return Promise.resolve('updated the program');
      });
      deleteProgramStub = sinon.stub(programs, 'deleteProgram', function() {
        return Promise.resolve('deleted the program');
      });
      getProgramsBySiteStub = sinon.stub(programs, 'getProgramsBySite', function() {
        return Promise.resolve('got the programs for a site');
      });
      createProgramStub = sinon.stub(programs, 'createProgram', function() {
        return Promise.resolve('created a program');
      });
      getProgramsByStudentStub = sinon.stub(programs, 'getProgramsByStudent', function() {
        return Promise.resolve('got the programs for a student');
      });
      getProgramsByAccountStub = sinon.stub(programs, 'getProgramsByAccount', function() {
        return Promise.resolve('got the programs for an account');
      });
    });

    after(function() {
      programs.getPrograms.restore();
      programs.getProgram.restore();
      programs.updateProgram.restore();
      programs.deleteProgram.restore();
      programs.getProgramsBySite.restore();
      programs.createProgram.restore();
      programs.getProgramsByStudent.restore();
      programs.getProgramsByAccount.restore();
    });

    it('GET /programs', function(done) {
      request(app)
        .get('/programs')
        .expect('got the programs', 200)
        .end(function() {
          assert.isTrue(getProgramsStub.called);
          done();
        });
    });

    it('GET /programs/:program_id', function(done) {
      request(app)
        .get('/programs/3')
        .expect('got the program', 200)
        .end(function() {
          assert.isTrue(getProgramStub.called);
          done();
        });
    });

    it('PUT /programs/:program_id', function(done) {
      request(app)
        .put('/programs/3')
        .expect('updated the program', 200)
        .end(function() {
          assert.isTrue(updateProgramStub.called);
          done();
        });
    });

    it('DELETE /programs/:program_id', function(done) {
      request(app)
        .delete('/programs/3')
        .expect('deleted the program', 200)
        .end(function() {
          assert.isTrue(deleteProgramStub.called);
          done();
        });
    });

    it('GET /sites/:site_id/programs', function(done) {
      request(app)
        .get('/sites/3/programs')
        .expect('got the programs for a sites', 200)
        .end(function() {
          assert.isTrue(getProgramsBySiteStub.called);
          done();
        });
    });

    it('POST /sites/:site_id/programs', function(done) {
      request(app)
        .post('/sites/3/programs')
        .expect('created a program', 200)
        .end(function() {
          assert.isTrue(createProgramStub.called);
          done();
        });
    });

    it('GET /students/:student_id/programs', function(done) {
      request(app)
        .get('/students/3/programs')
        .expect('got the programs for a student', 200)
        .end(function() {
          assert.isTrue(getProgramsByStudentStub.called);
          done();
        });
    });

    it('GET /accounts/:account_id/programs', function(done) {
      request(app)
        .get('/accounts/32/programs')
        .expect('got the programs for an account', 200)
        .end(function() {
          assert.isTrue(getProgramsByAccountStub.called);
          done();
        });
    });
  });

  describe('events endpoint', function() {
    var getEventsStub;
    var getEventStub;
    var deleteEventStub;
    var getEventsByProgramStub;
    var createEventStub;
    var getEventsByStudentStub;

    before(function() {
      getEventsStub = sinon.stub(events, 'getEvents', function() {
        return Promise.resolve('got the events');
      });
      getEventStub = sinon.stub(events, 'getEvent', function() {
        return Promise.resolve('got the event');
      });
      deleteEventStub = sinon.stub(events, 'deleteEvent', function() {
        return Promise.resolve('deleted the event');
      });
      createEventStub = sinon.stub(events, 'createEvent', function() {
        return Promise.resolve('created an event');
      });
      getEventsByStudentStub = sinon.stub(events, 'getEventsByStudent', function() {
        return Promise.resolve('got the events for a student');
      });
      getEventsByProgramStub = sinon.stub(events, 'getEventsByProgram', function() {
        return Promise.resolve('got the events for a program');
      });
    });

    after(function() {
      events.getEvents.restore();
      events.getEvent.restore();
      events.deleteEvent.restore();
      events.createEvent.restore();
      events.getEventsByStudent.restore();
      events.getEventsByProgram.restore();
    });

    it('GET /events', function(done) {
      request(app)
        .get('/events')
        .expect('got the events', 200)
        .end(function() {
          assert.isTrue(getEventsStub.called);
          done();
        });
    });

    it('GET /events/:event_id', function(done) {
      request(app)
        .get('/events/3')
        .expect('got the event', 200)
        .end(function() {
          assert.isTrue(getEventStub.called);
          done();
        });
    });

    it('DELETE /events/:event_id', function(done) {
      request(app)
        .delete('/events/3')
        .expect('deleted the event', 200)
        .end(function() {
          assert.isTrue(deleteEventStub.called);
          done();
        });
    });

    it('POST /accounts/:account_id/programs/:program_id/events', function(done) {
      request(app)
        .post('/accounts/1/programs/1/events')
        .expect('created an event', 200)
        .end(function() {
          assert.isTrue(createEventStub.called);
          done();
        });
    });

    it('GET /students/:student_id/events', function(done) {
      request(app)
        .get('/students/3/events')
        .expect('got the events for a student', 200)
        .end(function() {
          assert.isTrue(getEventsByStudentStub.called);
          done();
        });
    });

    it('GET /program/:program_id/events', function(done) {
      request(app)
        .get('/programs/1/events')
        .expect('got the events for a program', 200)
        .end(function() {
          assert.isTrue(getEventsByProgramStub.called);
          done();
        });
    });
  });
});