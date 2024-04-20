const { createUser, loginUser, deleteUser, getAllUsers } = require("../controllers/user.controller");

async function routes(fastify) {
    fastify.post("/auth/register", createUser);
    fastify.post("/auth", loginUser);
    fastify.delete("/", deleteUser);
    fastify.get("/", getAllUsers);
}

module.exports = routes;