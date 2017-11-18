const expect = require('expect');
const request = require('supertest');

const models = require('./../models');
const app = require('./../app').app;
const getSlug = require('speakingurl');
const router = require('./../controllers/home').router;

// beforeEach((done) => {
//      models.User.destroy({}).then(() => done()); 
// });

describe('Get /login', () => {
  it('should load the login page', (done) => {
    request(app)
      .get('/login')
      .expect(200).end(done);
  });
});

describe('Get /login', () => {
  it('should load the sign-up page', (done) => {
    request(app)
      .get('/sign-up')
      .expect(200).end(done);
  });
});

describe('Get /logins', () => {
  it('should not load anything', (done) => {
    request(app)
      .get('/logins')
      .expect(404).end(done);
  });
});

describe('Post /users', () => {
  it('should create a user', (done) => {
    var firstName = 'Wei1212';
    var lastName = 'Chen1212';
    var username = 'wei1212';
    var email = 'wei12121231321@gmail.com';
    var password = '123mnb';

    request(app)
      .post('/sign-up')
      .send({firstName, lastName, username, email, password_hash:password})
      .expect(200).end((err, res) => {
        if(err) {
          return done(err);
        }

        models.User.findOne({email}).then((user) => {
          console.log(user.firstName);
          expect(user).toExist;
          expect(user.firstName).toBe(firstName);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('Post /posts', () => {
  it('should create a post', (done) => {
    var title = "hello";
    var body = "world";

    request(app)
      .post('/posts')
      .send({
        slug: getSlug(title.toLowerCase()),
        title: title.toLowerCase(),
        body: body,
      })
      .expect(200).end((err, res) => {
        if(err) {
          return done(err);
        }
        models.Post.findOne({
          where: {
            slug: getSlug(body.title.toLowerCase()),
          }
        }).then((post) => {
          console.log(user.firstName);
          expect(post).toExist;
          expect(post.title).toBe(title);
          done();
        }).catch((e) => done(e));
      });
  });
});