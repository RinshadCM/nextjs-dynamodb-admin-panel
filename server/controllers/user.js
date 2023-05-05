const AWS = require('aws-sdk');
const User = require('../models/user');
const Blog = require('../models/blogSchema');
const { errorHandler } = require('../helpers/databaseErrorHandler');

AWS.config.update({
  region: 'us-east-1', // Update with your region
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.profileReadRequest = (req, res) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

exports.publicProfileReadRequest = (req, res) => {
  const username = req.params.username;

  const userParams = {
    TableName: 'users', // Update with your table name
    Key: {
      username: username,
    },
  };

  dynamodb.get(userParams, (err, userData) => {
    if (err) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    const user = userData.Item;

    const blogParams = {
      TableName: 'blogs', // Update with your table name
      IndexName: 'postedByIndex', // Update with your index name
      KeyConditionExpression: 'postedBy = :userId',
      ExpressionAttributeValues: {
        ':userId': user._id,
      },
      ProjectionExpression:
        '_id, title, slug, excerpt, categories, taglists, postedBy, createdAt, updatedAt',
      Limit: 10,
    };

    dynamodb.query(blogParams, (err, blogData) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      const blogs = blogData.Items.map((item) => {
        item.categories = item.categories ? item.categories.values : [];
        item.taglists = item.taglists ? item.taglists.values : [];
        item.postedBy = {
          _id: item.postedBy,
        };
        return item;
      });

      user.photo = undefined;

      res.json({
        user,
        blogs,
      });
    });
  });
};
