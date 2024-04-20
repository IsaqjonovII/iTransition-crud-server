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
        return reply.send({ user: userWithoutPassword, message: "Created successfully" });
    } catch (error) {
        return reply.send({ message: "Error occured in server", error });
    }
}

async function loginUser(req, reply) {
    try {
        const user = await User.findOne({ email: req.body.email }).exec();
        if (!user) {
            return reply.send({ message: "User doesn't exists!", status: 404 })
        }
        if (bcrypt.compare(req.body.password, user.password)) {
            const userWithoutPassword = JSON.parse(JSON.stringify(newUser));
            delete userWithoutPassword.password;
            return reply.send({ user: userWithoutPassword, message: "Logged in successfully" });
        }
        if (!bcrypt.compare(req.body.password, user.password)) {
            console.log("password or email incorrect")
            return reply.send({ message: "Login or password is incorrect" })
        }

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
async function changeUserStatus(req, reply) {
    try {
        const { id } = req.query;

        const user = await User.findById(id);
        if (!user) {
            return reply.send({ message: "User doesn't exists", status: 404 })
        }
        if (user.status === "active") {
            await User.findByIdAndUpdate({ status: "blocked" });
            return reply.send("User blocked");
        } else {
            await User.findByIdAndUpdate({ status: "active" });
            return reply.send("User activated");
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = { createUser, loginUser, deleteUser, getAllUsers, changeUserStatus }