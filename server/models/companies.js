const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: 'eu-north-1' }); // update with your desired region
const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: 'eu-north-1',
  TableName: 'details',
  ReadCapacityUnits: 1,
  WriteCapacityUnits: 1,
});

dynamodb.createTable(CompanyModel, function(err, data) {
  if (err) {
    console.log('Error creating table:', err);
  } else {
    console.log('Table created successfully:', data);
  }
});

const CompanyModel = {
  create: function(company, callback) {
    const params = {
      TableName: 'details',
      Item: {
        email: company.email,
        password: company.password || '',
        fname: company.fname || '',
        lname: company.lname || '',
        activecheck: company.activecheck || false,
        roles: company.roles,
        id: uuidv4() // add a unique ID for the record
      }
    };
    
    dynamodb.put(params, function(err, data) {
      if (err) {
        console.log('Error creating company record:', err);
        callback(err, null);
      } else {
        console.log('Company record created successfully:', data);
        callback(null, data);
      }
    });
  },
  
  read: function(email, callback) {
    const params = {
      TableName: 'details',
      Key: {
        email: email
      }
    };
    
    dynamodb.get(params, function(err, data) {
      if (err) {
        console.log('Error reading company record:', err);
        callback(err, null);
      } else {
        console.log('Company record read successfully:', data);
        callback(null, data.Item);
      }
    });
  },
  
  update: function(company, callback) {
    const params = {
      TableName: 'details',
      Key: {
        email: company.email
      },
      UpdateExpression: 'set password = :p, fname = :f, lname = :l, activecheck = :a, roles = :r',
      ExpressionAttributeValues: {
        ':p': company.password || '',
        ':f': company.fname || '',
        ':l': company.lname || '',
        ':a': company.activecheck || false,
        ':r': company.roles
      },
      ReturnValues: 'UPDATED_NEW'
    };
    
    dynamodb.update(params, function(err, data) {
      if (err) {
        console.log('Error updating company record:', err);
        callback(err, null);
      } else {
        console.log('Company record updated successfully:', data);
        callback(null, data.Attributes);
      }
    });
  },
  
  delete: function(email, callback) {
    const params = {
      TableName: 'details',
      Key: {
        email: email
      },
      ReturnValues: 'ALL_OLD'
    };
    
    dynamodb.delete(params, function(err, data) {
      if (err) {
        console.log('Error deleting company record:', err);
        callback(err, null);
      } else {
        console.log('Company record deleted successfully:', data);
        callback(null, data.Attributes);
      }
    });
  }
};

module.exports = CompanyModel;
