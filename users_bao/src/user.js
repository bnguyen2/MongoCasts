const mongoose = require('mongoose');
const PostSchema = require('./post');
const Schema = mongoose.Schema; // schema object => allows us to create schema for our user model

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: name => name.length > 2,
      message: 'Name must be longer than 2 characters.',
    },
    required: [true, 'Name is required.'],
  },
  posts: [PostSchema],
  likes: Number,
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'blogPost',
    },
  ],
});

UserSchema.virtual('postCount').get(function() {
  // use function keyword
  // if we use the fat arrow function, the context of this will be bound to the whole file, so this will not to refer to the instance of the user model
  return this.posts.length;
});

UserSchema.pre('remove', function(next) {
  const BlogPost = mongoose.model('blogPost');
  // this === joe

  // $in operator says go through all the records in the blogPost collections and look at their ID, if the ID is in the array, then remove that record
  // because this is async, we need to call next function => tells mongoose that everything we've done is complete, so go ahead and call the next middleware if one exists, or otherwise remove record
  BlogPost.remove({ _id: { $in: this.blogPosts } }).then(() => next());
});

// 1. Mongoose, says do we have a collection user, no? Let's make it
// 2. 2nd argument, instruct mongoose about the schema that we expect, by passing user schema, hey mongoose, anytime you're working with user, we expect that user to have a name and name to be string
// 3. User is user class/user model
const User = mongoose.model('user', UserSchema);

module.exports = User;
