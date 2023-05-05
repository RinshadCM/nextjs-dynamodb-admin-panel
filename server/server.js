const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
// const blogRoutes = require('./routes/blog');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
// const categoryRoutes = require('./routes/category');
// const tagRoutes = require('./routes/tag');

const app = express();

// Set the credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-north-1",
});

// Create a DynamoDB instance
const dynamodb = new AWS.DynamoDB.DocumentClient();

const PORT = process.env.PORT || 4000;
// console.log(dynamodb);

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// routes middlewares
// app.use('/api', blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
// app.use('/api', categoryRoutes);
// app.use('/api', tagRoutes);

app.get("/", (req, res) => {
  res.json({
    "get list of all companies": "/get-companies",
    "get details of a company by id": "/get-company/?_id=<company_id>",
    "post a new company": "/create-company",
    "update company details": "/update-company/?_id=<company_id> //PUT method",
    "delete company": "/delete-company/:id //DELETE method", // changed to path param
    "get list of all jobs using companyId": "/get-jobs",
    "post a new job": "/create-job",
    "update job details": "/update-job //PUT method",
    "delete job": "/delete-job //DELETE method",
  });
});

// get a single company by using _id
app.get("/get-company", (req, res) => {
  try {
    if (req.query.email !== undefined) {
      const params = {
        TableName: "details",
        Key: {
          email: req.query.email,
        },
      };

      dynamodb.get(params, (err, data) => {
        if (!err) {
          // console.log(data);
          res.send(data.Item);
        } else {
          console.log(err);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// get the list of all companies
// req.body.name / req.query.name
app.get("/get-companies", (req, res) => {
  const params = {
    TableName: "details",
  };
  dynamodb.scan(params, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result.Items);
    }
  });
});

// create operations
app.post("/create-company", async (req, res) => {
  const params = {
    TableName: "details",
    Item: req.body,
  };

  await dynamodb.put(params).promise();
  res.status(201).json(params.Item);
});

// * Update operations
app.put("/update-company", async (req, res) => {
  const email = req.query.email; // update to use email instead of id
  console.log(req.body);
  const params = {
    TableName: "details",
    Item: req.body,
    Key: {
      email: { S: email }, // update to use email instead of id
    },
    // UpdateExpression: 'SET #email = :email, #fname = :fname, #image = :image, #lname = :lname, #password = :password, #roles = :roles',
    // ExpressionAttributeNames: {
    //   '#email': 'email',
    //   '#fname': 'fname',
    //   '#image': 'image',
    //   '#lname': 'lname',
    //   '#password': 'password',
    //   '#roles': 'roles'
    // },
    // ExpressionAttributeValues: {
    //   ':email': { S: req.body.email },
    //   ':fname': { S: req.body.fname },
    //   ':image': { S: req.body.image },
    //   ':lname': { S: req.body.lname },
    //   ':password': { S: req.body.password },
    //   ':roles': { SS: req.body.roles }
    // }
  };

  try {
    const response = await dynamodb.put(params).promise();
    res.send(req.body);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// * Delete operations
app.delete("/delete-company/:id", async (req, res) => {
  console.log(req.params);
  const params = {
    TableName: "details",
    Key: {
      email: req.params.id,
    },
  };

  try {
    await dynamodb.delete(params).promise();
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not delete company" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
