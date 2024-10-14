import { connectToDatabase } from "./database";
import connectToServer from "core/requests";

export default async function startApplication() {
  connectToDatabase();
  connectToServer();
}
