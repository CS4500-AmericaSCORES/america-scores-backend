'use strict';

const chai = require('chai');
const assert = chai.assert;
const auth0 = require('../../lib/auth0_utils');

const ADMIN_AUTH0_ID = 'auth0|584377c428be27504a2bcf92';

describe('Auth0 Utils', function() {
  describe('getAuth0ID(acct_id)', function() {
    it('it should get the auth0 id for a given account id', function(done) {
      auth0.getAuth0ID('1').then(function(data) {
        assert.equal(data, ADMIN_AUTH0_ID);
        done();
      });
    });
    it('it should 404 when the account id doesn\'t exist', function(done) {
      auth0.getAuth0ID('999').catch(function(err) {
        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.status, 404);
        assert.equal(err.message, 'Invalid request: The given acct_id' +
          ' does not exist in the database');
        assert.equal(err.propertyName, 'acct_id');
        assert.equal(err.propertyValue, '999');
        done();
      });
    });
  });

  describe('getAuth0User(auth0_id)', function() {
    it('it should return the auth0 user for a given auth0 id', function(done) {
      auth0.getAuth0User(ADMIN_AUTH0_ID).then(function(data) {
        assert.equal(data.user_id, ADMIN_AUTH0_ID);
        assert.equal(data.email, 'ronlarge@americascores.org');
        assert.equal(data.user_metadata.first_name, 'Ron');
        assert.equal(data.user_metadata.last_name, 'Large');
        assert.equal(data.app_metadata.type, 'Coach');
        done();
      });
    });

    it('it should 404 when no auth0 user with the given id exists', function(done) {
      auth0.getAuth0User('999').catch(function(err) {
        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.status, 404);
        assert.equal(err.message, 'Invalid request: The given auth0_id' +
          ' does not exist in the database');
        assert.equal(err.propertyName, 'auth0_id');
        assert.equal(err.propertyValue, '999');
        done();
      });
    });
  });

  var createdAuth0Id;
  var test_first = 'Anna';
  var test_last = 'Smith';
  var test_username = 'annasmith';
  var test_email = 'a.smith@email.com';

  var first = 'Bob';
  var last = 'Pratt';
  var username = 'testusername';
  var email = 'test@email.com';
  var type = 'Staff';
  var password = 'TestPassw0rd';

  describe('createAuth0User(firstName, lastName, email, acctType, password)', function() {
    it('it should create an auth0 user for the given user data', function(done) {
      auth0.createAuth0User(first, last, username, email, type, password)
        .then(function(userId) {
          assert.isNotNull(userId);
          createdAuth0Id = userId;
          auth0.getAuth0User(userId).then(function(data) {
            assert.equal(data.username, username);
            assert.equal(data.email, email);
            assert.equal(data.user_metadata.first_name, first);
            assert.equal(data.user_metadata.last_name, last);
            assert.equal(data.app_metadata.type, type);
            done();
          });
        });
    });

    it('it should 400 when trying to create a user with a username that already exists',
      function(done) {
        auth0.createAuth0User(test_first, test_last, username, test_email, type, password)
          .catch(function(err) {
            assert.equal(err.statusCode, 400);
            done();
          });
    });

    it('it should 400 when trying to create a user that already exists (i.e. same email)',
      function(done) {
        auth0.createAuth0User(test_first, test_last, test_username, email, type, password)
          .catch(function(err) {
            assert.equal(err.statusCode, 400);
            done();
          });
    });

    // Note: currently the password policy is >= 8 characters, with lowercase, uppercase, number
    it('it should 400 when trying to create a user with a password that is too weak',
      function(done) {
        auth0.createAuth0User(test_first, test_last, test_username, test_email, type, 'testpassword')
          .catch(function(err) {
            assert.equal(err.statusCode, 400);
            done();
          });
      });

    // Note: currently the username policy is 4-15 characters
    it('it should 400 when trying to create a user with an invalid username',
      function(done) {
        auth0.createAuth0User(test_first, test_last, 'as', test_email, type, password)
          .catch(function(err) {
            assert.equal(err.statusCode, 400);
            done();
          });
      });

    it('it should 400 when trying to create a user with an invalid email',
      function(done) {
        auth0.createAuth0User(test_first, test_last, test_username, 'annasmith', type, password)
          .catch(function(err) {
            assert.equal(err.statusCode, 400);
            done();
          });
      });
  });

  describe('updateAuth0User(auth0_id, updates)', function() {
    it('it should update the email of the user', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {email: test_email}).then(function(data) {
        assert.equal(data.email, test_email);
        assert.equal(data.username, username);
        assert.equal(data.user_metadata.first_name, first);
        assert.equal(data.user_metadata.last_name, last);
        assert.equal(data.app_metadata.type, type);
        // reset
        auth0.updateAuth0User(createdAuth0Id, {email: email}).then(function(data) {
          assert.equal(data.email, email);
          done();
        });
      });
    });

    it('it should 400 when trying to update the email to an invalid email', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {email: 'notanemail'})
        .catch(function(err) {
          assert.equal(err.statusCode, 400);
          // make sure nothing changed
          auth0.getAuth0User(createdAuth0Id).then(function(data) {
            assert.equal(data.email, email);
            done();
          });
        });
    });

    it('it should 400 when trying to update the email to one that already exists', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {email: 'ronlarge@americascores.org'})
        .catch(function(err) {
          assert.equal(err.statusCode, 400);
          // make sure nothing changed
          auth0.getAuth0User(createdAuth0Id).then(function(data) {
            assert.equal(data.email, email);
            done();
          });
        });
    });

    it('it should update the username of the user', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {username: test_username}).then(function(data) {
        assert.equal(data.email, email);
        assert.equal(data.username, test_username);
        assert.equal(data.user_metadata.first_name, first);
        assert.equal(data.user_metadata.last_name, last);
        assert.equal(data.app_metadata.type, type);
        // reset
        auth0.updateAuth0User(createdAuth0Id, {username: username}).then(function(data) {
          assert.equal(data.username, username);
          done();
        });
      });
    });

    it('it should 400 when trying to update the username to an invalid username', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {username: 'bp'})
        .catch(function(err) {
          assert.equal(err.statusCode, 400);
          // make sure nothing changed
          auth0.getAuth0User(createdAuth0Id).then(function(data) {
            assert.equal(data.username, username);
            done();
          });
        });
    });

    it('it should 400 when trying to update the username to one that already exists', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {username: 'test1'})
        .catch(function(err) {
          assert.equal(err.statusCode, 400);
          // make sure nothing changed
          auth0.getAuth0User(createdAuth0Id).then(function(data) {
            assert.equal(data.username, username);
            done();
          });
        });
    });

    it('it should 400 when trying to update the username and email simultaneously', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {username: test_username, email: test_email})
        .catch(function(err) {
          assert.equal(err.statusCode, 400);
          // make sure nothing changed
          auth0.getAuth0User(createdAuth0Id).then(function(data) {
            assert.equal(data.username, username);
            assert.equal(data.email, email);
            done();
          });
        });
    });

    // TODO: figure out a way to verify password was actually updated
    it('it should update the password of the user', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {password: 'An0therPassw0rd'}).then(function(data) {
        assert.equal(data.email, email);
        assert.equal(data.username, username);
        assert.equal(data.user_metadata.first_name, first);
        assert.equal(data.user_metadata.last_name, last);
        assert.equal(data.app_metadata.type, type);
        // reset
        auth0.updateAuth0User(createdAuth0Id, {password: password}).then(function(data) {
          done();
        });
      });
    });

    it('it should 400 when trying to update the password to an invalid password', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {password: 'notapassword'})
        .catch(function(err) {
          assert.equal(err.statusCode, 400);
          // TODO: make sure nothing changed
          // auth0.getAuth0User(createdAuth0Id).then(function(data) {
          //  done();
          // });
          done();
        });
    });

    it('it should 400 when trying to update the password and email simultaneously', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {email: test_email, password: 'An0therPassw0rd'})
        .catch(function(err) {
          assert.equal(err.statusCode, 400);
          // make sure nothing changed
          auth0.getAuth0User(createdAuth0Id).then(function(data) {
            assert.equal(data.email, email);
            // TODO: verify password is the same
            done();
          });
        });
    });

    it('it should 400 when trying to update the password and username simultaneously', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {username: test_username, password: 'An0therPassw0rd'})
        .catch(function(err) {
          assert.equal(err.statusCode, 400);
          // make sure nothing changed
          auth0.getAuth0User(createdAuth0Id).then(function(data) {
            assert.equal(data.username, username);
            // TODO: verify password is the same
            done();
          });
        });
    });

    it('it should update the user_metadata of the user', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {first_name: test_first}).then(function(data) {
        assert.equal(data.email, email);
        assert.equal(data.username, username);
        assert.equal(data.user_metadata.first_name, test_first);
        assert.equal(data.user_metadata.last_name, last);
        assert.equal(data.app_metadata.type, type);
        // reset
        auth0.updateAuth0User(createdAuth0Id, {first_name: first}).then(function(data) {
          assert.equal(data.user_metadata.first_name, first);
          done();
        });
      });
    });

    it('it should update the app_metadata of the user', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {type: 'Volunteer'}).then(function(data) {
        assert.equal(data.email, email);
        assert.equal(data.username, username);
        assert.equal(data.user_metadata.first_name, first);
        assert.equal(data.user_metadata.last_name, last);
        assert.equal(data.app_metadata.type, 'Volunteer');
        // reset
        auth0.updateAuth0User(createdAuth0Id, {type: type}).then(function(data) {
          assert.equal(data.app_metadata.type, type);
          done();
        });
      });
    });

    // supported fields: username, email, password, type, user_metadata.first_name, last_name
    it('it should 501 when trying to update an unsupported field', function(done) {
      auth0.updateAuth0User(createdAuth0Id, {notafield: 'anything'})
        .catch(function(err) {
          assert.equal(err.status, 501);
          assert.equal(err.name, 'UnsupportedRequest');
          assert.equal(err.message, 'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
          done();
        });
    });
  });

  describe('deleteAuth0User(auth0_id)', function() {
    it('it should delete an auth0 user with the given id', function(done) {
      // ensure user exists
      auth0.getAuth0User(createdAuth0Id).then(function(data) {
        assert.equal(data.user_id, createdAuth0Id);
        // delete user
        auth0.deleteAuth0User(createdAuth0Id).then(function(data) {
          // ensure user doesn't exist
          auth0.getAuth0User(createdAuth0Id).catch(function(err) {
            assert.equal(err.name, 'ArgumentNotFoundError');
            assert.equal(err.status, 404);
            assert.equal(err.message, 'Invalid request: The given auth0_id' +
              ' does not exist in the database');
            assert.equal(err.propertyName, 'auth0_id');
            assert.equal(err.propertyValue, createdAuth0Id);
            done();
          });
        });
      });
    });

    // TODO: it looks like the Auth0 API wrapper swallows this error?
    xit('it should 204 when trying to delete an auth0 user that doesn\'t exist', function(done) {
      auth0.deleteAuth0User(createdAuth0Id).catch(function(err) {
        assert.equal(err.statusCode, 204);
        done();
      });
    });
  });
});

