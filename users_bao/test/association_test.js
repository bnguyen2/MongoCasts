const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe, blogPost, comment;

  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({
      title: 'JS is Great',
      content: 'Yep it really is',
    });
    comment = new Comment({
      content: 'Congrats on great post',
    });

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    // provided by es6 specs, the all property is a function that takes in an array of promises. We can combine all 3 promises and get a single . then state when all 3 resovled
    Promise.all([joe.save(), blogPost.save(), comment.save()]).then(() =>
      done()
    );
  });

  // only when we see the .then, its when the query is executed
  // using it.only will only load this one test
  it('saves a relation between a user and a blogpost', done => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts') // make sure modifier has the correct reference to the property
      .then(user => {
        assert(user.blogPosts[0].title === 'JS is Great');
        done();
      });
  });

  it('saves a full relation graph', done => {
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts', // path option => inside the user we fetched, recursively load this all the associated resource
        populate: {
          path: 'comments', // inside of the all the blogPosts we fetched, go further inside and load up additional associations
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user',
          },
        },
      })
      .then(user => {
        // console.log(user.blogPosts[0].comments[0]);
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(
          user.blogPosts[0].comments[0].content === 'Congrats on great post'
        );
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');
        done();
      });
  });
});
