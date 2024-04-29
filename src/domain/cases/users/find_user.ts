import { FilterQuery } from "mongoose";
import { UserSchema, mongooseModelManager } from "../../models/user_model";

const findUser = async (query: FilterQuery<UserSchema>) => {
  const user = await mongooseModelManager.find(query);
  return user;
};

export default findUser;
