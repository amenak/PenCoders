const expect = require('expect');
const request = require('supertest');
const models = require('./../models');
const app = require('./../app').app;
const router = require('./../controllers/home').router;

describe('Post /users', () => {
  it('should create a user', (done) => {
    var firstName = 'Wei';
    var lastName = 'Chen';
    var username = 'wei';
    var email = 'wei@gmail.com';
    var password = '123mnb';

    request(app)
      .post('/sign-up')
      .send({firstName, lastName, username, email, password})
      .expect(200).end((err) => {
        if(err) {
          return done(err);
        }

        models.User.findOne({email}).then((user) => {
          expect(user).toExist;
          done();
        });
      });
  });
});