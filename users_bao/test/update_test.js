const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
  let joe;

  beforeEach(done => {
    joe = new User({ name: 'Joe', likes: 0 });
    joe.save().then(() => done());
  });

  function assertName(operation, done) {
    operation
      .then(() => User.find({})) // passing in an empty object means give you everything
      .then(users => {
        assert(users.length === 1);
        assert(users[0].name === 'Alex');
        done();
      });
  }

  // set n save is best when want to update a several different properties in different steps, and only after will we make the final save
  it('instance type using set n save', done => {
    joe.set('name', 'Alex'); // set is saved in memory
    assertName(joe.save(), done);
  });

  // best when we have a very particular record already loaded up
  it('A model instance can update', done => {
    assertName(joe.update({ name: 'Alex' }), done);
  });

  it('A model class can update', done => {
    assertName(User.update({ name: 'Joe' }, { name: 'Alex' }), done);
  });

  // update a single record by passing in a unique attribute
  it('A model class can update one record', done => {
    assertName(User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }), done);
  });

  it('A model class can find and record with an ID and update', done => {
    assertName(User.findByIdAndUpdate(joe._id, { name: 'Alex' }), done);
  });

  it('A user can have their postcount incremented by 1', done => {
    // User.update({ name: 'Joe' }, { postCount: 1 }); // wrong path (its saying set every user postcount by 1, not increment)
    User.update({ name: 'Joe' }, { $inc: { likes: 10 } })
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(user.likes === 10);
        done();
      });
  });
});
