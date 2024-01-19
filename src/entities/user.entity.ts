import { Entity, JsonType, Property } from "@mikro-orm/mongodb";
import { BaseEntity } from "./base.entity";

@Entity()
export class User extends BaseEntity {
  @Property({ type: JsonType })
  methods: { method1?: string; method2?: string } = {};
}
