const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const { promisify } = require('util');
const AWS = require('aws-sdk');

// Set the credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-north-1'
  });

const docClient = new DocumentClient();
const promisifiedScan = promisify(docClient.scan).bind(docClient);
const promisifiedGet = promisify(docClient.get).bind(docClient);
const promisifiedPut = promisify(docClient.put).bind(docClient);


exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    const params = {
        TableName: process.env.USERS_TABLE,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
    };

    try {
        const result = await promisifiedScan(params);

        if (result.Count > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();
        const username = id;
        const profile = `http://localhost:3000/profile/${username}`;

        const item = {
            id,
            name,
            email,
            password: hashedPassword,
            username,
            profile,
        };

        await promisifiedPut({ TableName: process.env.USERS_TABLE, Item: item });

        res.json({ message: 'Completed Signup process. Please Login to continue' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const params = {
        TableName: process.env.USERS_TABLE,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
    };

    try {
        const result = await promisifiedScan(params);

        if (result.Count === 0) {
            return res.status(400).json({ error: "You forgot to 'SignUp'.Email does not exist" });
        }

        const user = result.Items[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Email and password does not match' });
        }

        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '365d' });

        res.cookie('token', token, { expiresIn: '365d' });

        const { id, username, name, email, role } = user;
        return res.json({
            token,
            user: { id, username, name, email, role },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
};

// Logout
exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Successfully logged out"
    });
};

// Require login middleware for protecting routes
exports.requireLogin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    jwt.verify(token, "key123", (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token." });
        }
        req.user = decoded;
        next();
    });
};

// Authentication middleware
exports.authenticationMiddleware = (req, res, next) => {
    const authenticateUserId = req.user._id;
    const paramsUsername = req.params.username;
    const paramsId = req.params.userId;
    User.get({ id: authenticateUserId }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        // Check if the authenticated user matches the requested user
        if (paramsUsername && user.username !== paramsUsername) {
            return res.status(401).json({
                error: "Unauthorized access"
            });
        }
        if (paramsId && user.id !== paramsId) {
            return res.status(401).json({
                error: "Unauthorized access"
            });
        }
        req.profile = user;
        next();
    });
};
