const bcrypt = require("bcrypt");
const User = require("../models/user.model");

//* <<<< USER AUTHENTICATION >>>>
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
        //* need refac:
        const userWithoutPassword = JSON.parse(JSON.stringify(result));
        delete userWithoutPassword.password;
        return reply.send({ user: userWithoutPassword, message: "Created successfully", status: 200 });
    } catch (error) {
        return reply.send({ message: "Error occured in server", error });
    }
}

async function loginUser(req, reply) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return reply.send({ message: "User doesn't exists!", status: 404 })
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password).then(res => res);
        if (!passwordMatch) {
            return reply.send({ message: "Login or password is incorrect" })
        }
        if (user.status !== "active") {
            return reply.send({ message: "You're blocked and you can't log in. Create a account" })
        }
        await User.findByIdAndUpdate(user._id, { lastLogin: Date.now() })
        const userWithoutPassword = { ...user.toObject() };
        delete userWithoutPassword.password;
        return reply.send({ user: userWithoutPassword, message: "Logged in successfully", status: 200 });

    } catch (error) {
        return reply.send({ message: "Error occured in server", error });
    }
}

//* <<<< USER ACTIONS >>>>

async function deleteUser(req, reply) {
    try {
        const { id } = req.query;

        //? 1. find the user
        const user = await User.findById(id).exec();
        if (!user) {
            return reply.send({ message: "User doesn't exists!", status: 404 });
        }
        await User.findByIdAndDelete(id);
        return reply.send({ message: "User deleted successfully" });
    } catch (error) {

    }
}

async function getAllUsers(_, reply) {
    try {
        const users = await User.find().select("-password");
        return reply.send({ users });
    } catch (error) {
        console.log(error);
        return reply.send({ message: "Error occured", error })
    }
}
async function blockUser(req, reply) {
    try {
        const { id } = req.query;

        const user = await User.findById(id);
        if (!user) {
            return reply.send({ message: "User doesn't exists", status: 404 })
        }
        if (user.status === "active") {
            await User.findByIdAndUpdate(id, { status: "blocked" });
            return reply.send({ message: "User blocked" });
        } else {
            return reply.send({ message: "User is already blocked" });
        }
    } catch (error) {
        console.log(error);
    }
}
async function unBlockUser(req, reply) {
    try {
        const { id } = req.query;

        const user = await User.findById(id);
        if (!user) {
            return reply.send({ message: "User doesn't exists", status: 404 })
        }
        if (user.status === "blocked") {
            await User.findByIdAndUpdate(id, { status: "active" });
            return reply.send({ message: "User activated" });
        } else {
            return reply.send({ message: "User is already activated" });
        }

    } catch (error) {
        return reply.status(500).send({ message: "Error occured in server", error });
    }
}

async function changeUsersStatus(req, reply) {
    try {
        const { actionType, users } = req.query;
        if (actionType === "block") {
            users.split(",").forEach(async (userId) => {
                await User.findByIdAndUpdate(userId, { status: "blocked" });
            });
            return reply.send({ message: "Users are blocked" });
        } else {
            users.split(",").forEach(async (userId) => {
                await User.findByIdAndUpdate(userId, { status: "active" });
            })
            return reply.send({ message: "Users are unblocked" });
        }
    } catch (error) {
        return reply.status(500).send({ message: "Error occured in server", error });
    }
}

module.exports = { createUser, loginUser, deleteUser, getAllUsers, blockUser, unBlockUser, changeUsersStatus }