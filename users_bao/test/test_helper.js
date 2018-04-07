const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// before is only executable one time before all test suite
before(done => {
  // requires you tell it explicity where the server you're trying to connect, users_test is the different DB instance, we do not have to create a Mongo DB ahead of time
  mongoose.connect('mongodb://localhost/users_tests');
  mongoose.connection
    .once('open', () => {
      done();
    })
    .on('Warning', error => {
      console.warn('Error', error);
    });
});

// hook => a function that will be executed before any test run inside our test suite
beforeEach(done => {
  // tells mocha, when I call this function, it means I'm all complete, you can now run the next test
  const { users, comments, blogposts } = mongoose.connection.collections;
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});
