import database from "core/database";
import { Request } from "core/http/request";

export default async function createUser(requset: Request) {
  const name = requset.input("name");
  const email = requset.input("email");
  // const name = requset.body.name.value;
  // const email = requset.body.email.value;

  // const usersCollection = database.collection("users");

  // const result = await usersCollection.insertOne({
  //   name,
  //   email,
  //   published: true,
  // });

  return {
    user: {
      // id: result.insertedId,
      name,
      email,
    },
  };
}
