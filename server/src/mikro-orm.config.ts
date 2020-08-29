import { Post } from "./entities/Post";
import { isProduction } from "./constants";
import path from "path";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  debug: !isProduction,
} as Parameters<typeof MikroORM.init>[0];
