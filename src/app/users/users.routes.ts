import router from "core/router";
import usersList from "./controllers/users-list.controller";
import getUser from "./controllers/get-user.controller";
import createUser from "./controllers/create-user.controller";
import User from "./models/user";
import { ObjectId } from "mongodb";
import queryBuilder from "core/database/query-builder/query-builder";

router.get("/users", usersList);
router.get("/users/:id", getUser);

router.post("/create-account", createUser);
