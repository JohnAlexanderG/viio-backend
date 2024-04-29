import { MongooseModelManager } from "itrm-tools";
import { SchemaDefinition } from "mongoose";

interface UserSchema extends SchemaDefinition {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const options = {
  timestamps: true,
  versionKey: "_v",
};

const userDefinition = {
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

const mongooseModelManager = new MongooseModelManager<UserSchema>(
  "users",
  userDefinition,
  options
);

export { UserSchema, mongooseModelManager };
