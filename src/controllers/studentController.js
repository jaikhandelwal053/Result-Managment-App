//importing student model
const Student = require('../models/student');

const student_login_get = (req, res) => {
       res.render("student/login");
    };

const student_login_post = async (req, res) => {
      const Stroll = req.body.roll; 
      const Stdob = req.body.dob;  
    
      const individualStudent = await Student.findOne({ roll: Stroll, dob: Stdob });
      if (!individualStudent) {
        return res.render("student/login", {
          error: "Login with correct Credentials"
        });
      }
    
      res.render("student/result", { one: individualStudent });
    };    

//exporting student controller functions
module.exports={
    student_login_get,
    student_login_post
}