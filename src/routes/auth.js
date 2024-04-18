const { createUser, loginUser } = require("../controllers/auth.controller");

async function routes(fastify){
    fastify.post("/register", createUser);
    fastify.post("/", loginUser)
}

module.exports = routes