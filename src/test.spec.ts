import { MikroORM, MongoDriver } from "@mikro-orm/mongodb";
import { User } from "./entities/user.entity";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { BaseEntity } from "./entities/base.entity";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    driver: MongoDriver,
    clientUrl: process.env.MONGO_URL,
    dbName: "jest",
    entities: [BaseEntity, User],
    debug: true,
    highlighter: new MongoHighlighter(),
  });
});

afterAll(async () => {
  await orm.close();
});

it("should update json properties with assign()", async () => {
  // initialing user
  const user1 = new User();
  user1.methods = { method1: "1", method2: "1" };
  const em1 = orm.em.fork();
  await em1.persistAndFlush(user1);

  // verify that it was persisted properly
  const emRead1 = orm.em.fork();
  const result1 = await emRead1.findOneOrFail(User, { _id: user1._id });
  expect(result1.methods).toEqual({ method1: "1", method2: "1" });

  // updating JSON property without assign() should work
  const em2 = orm.em.fork();
  const user2 = await em2.findOneOrFail(User, { _id: user1._id });
  user2.methods = { method1: "1", method2: "2" };
  await em2.persistAndFlush(user2);

  // verify that it was persisted properly
  const emRead2 = orm.em.fork();
  const result2 = await emRead2.findOneOrFail(User, { _id: user1._id });
  expect(result2.methods).toEqual({ method1: "1", method2: "2" });

  // updating JSON property with assign() should work
  const em3 = orm.em.fork();
  const user3 = await em3.findOneOrFail(User, { _id: user1._id });
  em3.assign(user3, { methods: { method2: "3" } });
  await em3.persistAndFlush(user3);

  // verify that it was persisted properly
  const emRead3 = orm.em.fork();
  const result3 = await emRead3.findOneOrFail(User, { _id: user1._id });
  // --> THIS FAILS from Mikro-ORM v5.6.10 and above
  expect(result3.methods).toEqual({ method1: "1", method2: "3" });
});