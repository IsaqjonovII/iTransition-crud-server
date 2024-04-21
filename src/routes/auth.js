const { createUser, loginUser, deleteUser, getAllUsers, blockUser, unBlockUser } = require("../controllers/user.controller");

async function routes(fastify) {
    fastify.post("/auth/register", createUser);
    fastify.post("/auth", loginUser);
    fastify.delete("/", deleteUser);
    fastify.get("/", getAllUsers);
    fastify.put("/block", blockUser,);
    fastify.put("/", unBlockUser)
}

module.exports = routes;