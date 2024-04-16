const { createUser } = require("../controllers/auth.controller");

async function routes(fastify){
    fastify.post("/register", createUser);
}

module.exports = routes