import router from "core/router";
import usersList from "./controllers/users-list.controller";
import getUser from "./controllers/get-user.controller";
import createUser from "./controllers/create-user.controller";

router.get("/users", usersList);
router.get("/users/:id", getUser);

router.post("/users", createUser);
