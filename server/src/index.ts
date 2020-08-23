import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig); // connect db
  // do migration
  const migrator = orm.getMigrator();
  await migrator.createMigration();
  //   await migrator.up();
  // run sql
  const post = orm.em.create(Post, { title: "first post" });
  await orm.em.persistAndFlush(post);
  //   console.log("------sql 2--------");
  //   await orm.em.nativeInsert(Post, { title: "second post" });
  const posts = await orm.em.find(Post, {});
  console.log(posts);
};

main().catch((err) => console.error(err));
