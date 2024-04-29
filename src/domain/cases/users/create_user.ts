import { UserSchema, mongooseModelManager } from "../../models/user_model";

const createUser = async ({ first_name, last_name, email, password }: UserSchema) => {
  const user = await mongooseModelManager.create({ first_name, last_name, email, password });
  return user;
};

export default createUser;
