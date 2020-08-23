import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import mikroConfig from "./mikro-orm.config";
import { PORT } from "./constants";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig); // connect db
  // do migration
  //   await orm.getMigrator().up();
  // const migrator = orm.getMigrator();
  // await migrator.createMigration();
  //   await migrator.up();

  const app = express();
  // rest API way
  // app.get("/", (_, res) => res.send("hello"));
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
    }),
    context: () => ({ em: orm.em }),
  });
  apolloServer.applyMiddleware({ app });
  app.listen(PORT, () => console.log(`listening on ${PORT}`));

  // run sql
  //   const post = orm.em.create(Post, { title: "first post" });
  //   await orm.em.persistAndFlush(post);
  //   //   console.log("------sql 2--------");
  //   //   await orm.em.nativeInsert(Post, { title: "second post" });
  //   const posts = await orm.em.find(Post, {});
  //   console.log(posts);
};

main().catch((err) => console.error(err));
