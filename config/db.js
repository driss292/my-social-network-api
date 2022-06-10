const mongoose = require("mongoose");
const colors = require("colors");

mongoose
  //   .connect(process.env.MONGODB_URI)
  .connect(process.env.MONGODB_URI_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log(colors.rainbow(`Connected to MongoDB `)))
  .catch((err) => console.log(colors.red(`Failed to connect to MongoDB`, err)));
