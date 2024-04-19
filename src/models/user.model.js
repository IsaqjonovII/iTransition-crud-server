const { Schema, model } = require("mongoose");


const UserSchema = new Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 15,
    },
    email: {
        type: String,
        minLength: 4,
        maxLength: 24,
        required: true
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 1024
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active"
    }
});

const User = model("user", UserSchema);

module.exports = User;