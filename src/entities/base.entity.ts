import { PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class BaseEntity {
  @PrimaryKey({ type: "ObjectId" })
  _id = new ObjectId();
  @SerializedPrimaryKey()
  id!: string;
}
