//importing student model
const Student = require('../models/student');

const teacher_user_session = (req, res, next) => {
    res.locals.user = req.session.user;
    next();
  };

const teacher_login_get = (req, res) => {
    if (req.session.user) {
        return res.redirect("./");
      }
    res.render("teacher/teacherLogin");
};

const teacher_login_post = async (req, res) => {

//________Teacher Login Password________
    if(req.body.password == "Teacher"){
        req.session.user = "teacher";
        return res.redirect("./");
    }
    else{
        res.render("teacher/teacherLogin", {
            error : "Please Enter Correct Password"
        })
    }
};
const teacher_view_all_get = async (req, res) =>{
    if (!req.session.user) {
        return res.redirect("teacher/login");
      }
      try {
        const allStudents = await Student.find() 
        res.render("teacher/dashboard", {student : allStudents})
        
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    
};
const teacher_viewall_get = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/teacher/login");
  }
    const allStudents = await Student.find({}); 
    res.render("teacher/viewall", {student : allStudents})
  };
  
  const teacher_edit_get =async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/teacher/login");
    }
    const user = await Student.findById(req.params.id)
    res.render("teacher/edit", {user : user})
  };

  const teacher_edit_post =async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/teacher/login");
    }
    const st = await Student.findByIdAndUpdate(req.params.id,req.body)
    if(!st){
      res.send('object not found with this id')
      return;
    }
    const allStudents = await Student.find({}); 
    return res.render("teacher/viewall", { success: `Record updated successfully`, student : allStudents});
};

const teacher_delete_get =async (req, res) => {
  if (!req.session.user) {
    return res.redirect("teacher/login");
  }
  await Student.findByIdAndDelete(req.params.id)
  res.redirect("/teacher/viewall")
  return res.render("teacher/viewall", { success: `Record deleted successfully` });
};

const teacher_dashboard_get = (req,res) => {
  if (!req.session.user) {
    return res.redirect("./login");
  }
  res.render("teacher/dashboard")
};

const teacher_add_get = (req, res) => {
  if (!req.session.user) {
    res.redirect("./login");
  }
  res.render("teacher/addstudent");
};
const teacher_add_post = async (req, res) => {
  const singleStudent = new Student({
      name : req.body.name,  
      roll : req.body.roll,             
      dob : req.body.dob,
      score : req.body.score        
    })
    try {
        const Sroll = req.body.roll;
        const existingStudent = await Student.findOne({ roll: Sroll });
        if (existingStudent) {
          return res.render("teacher/addstudent", { error: "Roll Number already exists" });
        }
        const newStudent = await singleStudent.save();
        return res.render("teacher/addstudent", { success: "Record added successfully" });
      } catch { 
        res.send("error")
    }
};
const teacher_logout = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }else {
        res.render("index", { success: "Teacher Logout successfully" });
      }
    });
  };

//exporting teacher controller functions
module.exports={
    teacher_login_get,
    teacher_login_post,
    teacher_viewall_get,
    teacher_edit_get,
    teacher_edit_post,
    teacher_delete_get,
    teacher_add_post,
    teacher_add_get,
    teacher_dashboard_get,
    teacher_logout,
    teacher_user_session,
    teacher_view_all_get
}