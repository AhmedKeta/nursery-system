const mongoose = require("mongoose");


exports.mongoConnect = (callback) => {
  mongoose
    .connect(
      "mongodb+srv://ahmedketa12:Vforvendetta@cluster0.o911ffn.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Cloud db server connected .....");
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

