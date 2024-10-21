import { rootPath } from "@mongez/node";
import database from "core/database";
import { Request } from "core/http/request";
import User from "../models/user";

export default async function createUser(request: Request) {
  const { name, email } = request.body;

  const usersCollection = User.query();

  // const image = requset.file("image");

  // let name = "";

  // if (image) {
  //   name = await image.save(rootPath("storage/images"));
  // }

  // const name = requset.input("name");
  // const email = requset.input("email");
  // const name = requset.body.name.value;
  // const email = requset.body.email.value;

  // const usersCollection = database.collection("users");

  // const result = await usersCollection.insertOne({
  //   name,
  //   email,
  //   published: true,
  // });

  return {
    name,
    // image: {
    //   name,
    //   size: await image?.size(),
    // },
    // user: {
    //   // id: result.insertedId,
    //   // name,
    //   // email,
    // },
  };
}

createUser.validation = {
  rules: {
    name: ["required", "string"],
    email: ["required", "string"],
  },
  validate: async () => {
    return {};
  },
};
