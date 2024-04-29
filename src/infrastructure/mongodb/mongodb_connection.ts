import mongoose from "mongoose";

const connect = () => {
  return mongoose.connect(
    "mongodb://root:1234@mongoviio:27017/viiodb?authSource=admin&tls=false"
  );
};

export default { connect };
