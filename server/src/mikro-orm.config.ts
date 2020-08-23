import { Post } from "./entities/Post";
import { isProduction } from "./constants";
import path from "path";
import { MikroORM } from "@mikro-orm/core";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: "lireddit",
  type: "postgresql",
  debug: !isProduction,
} as Parameters<typeof MikroORM.init>[0];
