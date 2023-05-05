const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

AWS.config.update({ region: 'eu-north-1' }); // update with your desired region
const dynamodb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: 'eu-north-1',
    TableName: 'users',
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
});

const User = {
    create: function (user, callback) {
        const params = {
            TableName: 'users',
            Item: {
                username: user.username,
                name: user.name,
                email: user.email,
                profile: user.profile,
                salt: this.makeSalt(),
                hashed_password: this.encryptPassword(user.password),
                role: user.role || 0,
                id: uuidv4() // add a unique ID for the record
            }
        };

        dynamodb.put(params, function (err, data) {
            if (err) {
                console.log('Error creating user record:', err);
                callback(err, null);
            } else {
                console.log('User record created successfully:', data);
                callback(null, data);
            }
        });
    },

    read: function (username, callback) {
        const params = {
            TableName: 'users',
            Key: {
                username: username
            }
        };

        dynamodb.get(params, function (err, data) {
            if (err) {
                console.log('Error reading user record:', err);
                callback(err, null);
            } else {
                console.log('User record read successfully:', data);
                callback(null, data.Item);
            }
        });
    },

    update: function (user, callback) {
        const params = {
            TableName: 'users',
            Key: {
                username: user.username
            },
            UpdateExpression: 'set name = :n, email = :e, profile = :p, hashed_password = :h, salt = :s, role = :r',
            ExpressionAttributeValues: {
                ':n': user.name || '',
                ':e': user.email || '',
                ':p': user.profile || '',
                ':h': this.encryptPassword(user.password) || '',
                ':s': this.makeSalt() || '',
                ':r': user.role || 0
            },
            ReturnValues: 'UPDATED_NEW'
        };

        dynamodb.update(params, function (err, data) {
            if (err) {
                console.log('Error updating user record:', err);
                callback(err, null);
            } else {
                console.log('User record updated successfully:', data);
                callback(null, data.Attributes);
            }
        });
    },

    delete: function (username, callback) {
        const params = {
            TableName: 'users',
            Key: {
                username: username
            },
            ReturnValues: 'ALL_OLD'
        };

        dynamodb.delete(params, function (err, data) {
            if (err) {
                console.log('Error deleting user record:', err);
                callback(err, null);
            } else {
                console.log('User record deleted successfully:', data);
                callback(null, data.Attributes);
            }
        });
    },

    authenticate: function (user, callback) {
        const params = {
            TableName: 'users',
            Key: {
                username: user.username
            }
        };

        dynamodb.get(params, function (err, data) {
            if (err) {
                console.log('Error reading user record:', err);
                callback(err, null);

            } else {
                const hashed_password = crypto
                    .createHmac('sha1', data.Item.salt.S)
                    .update(user.password)
                    .digest('hex');
                if (hashed_password === data.Item.hashed_password.S) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            }
        });
    }
};

module.exports = User;    