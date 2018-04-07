const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: String,
  content: String,
  comments: [
    {
      type: Schema.Types.ObjectId, // this type will point off to a record that is sitting in the collection (passing a reference to another model)
      ref: 'comment', // ref will be matched up against the model definition
    },
  ],
});

const BlogPost = mongoose.model('blogPost', BlogPostSchema);

module.exports = BlogPost;
