const bcrypt = require("bcrypt");
const User = require("../models/user.model");

async function createUser(req, reply) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return reply.send({ message: "User already exists!", status: 401 })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User({ name, email, password: hashedPassword });
        const result = await newUser.save();
        const userWithoutPassword = JSON.parse(JSON.stringify(result));
        delete userWithoutPassword.password;
        return reply.send({ user: userWithoutPassword, message: "Created successfully" });
    } catch (error) {
        return reply.send({ message: "Error occured in server", error });
    }
}

async function loginUser(req, reply) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !bcrypt.compare(req.body.password)) {
            return reply.send({ message: "User doesn't exists!", status: 404 })
        }

        const userWithoutPassword = JSON.parse(JSON.stringify(newUser));
        delete userWithoutPassword.password;
        return reply.send({ user: userWithoutPassword, message: "Created successfully" });

    } catch (error) {
        return reply.send({ message: "Error occured in server", error });
    }
}

module.exports = { createUser, loginUser }