const mongoose = require("mongoose")

// schema represents the structure of particular document
const { Schema } = mongoose;

const studentSchema = new Schema({
  roll: {
    type : Number,
    unique : true,
    require : true
  } ,
  name: {
    type : String,
    require : true
  },    
  dob:{
    type : Date,
    require : true
  } ,
  score: {
    type : Number,
    require : true
  } 
});

//exporting the model
module.exports = mongoose.model("Student", studentSchema)