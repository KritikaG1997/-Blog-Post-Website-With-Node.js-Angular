const { Schema, model } = require("mongoose");

const walletSchema = Schema(
  {
    balance: 
    { type: Number, default: 100000 },
    
  },
  
  // { timestamps: true }
);
// console.log(walletSchema)

module.exports = model("companywallet", walletSchema);