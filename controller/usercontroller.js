const userModel = require("../model/usermodel");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


exports.InsertData = async (req, res) => {
    try {
        var b_pass =  await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;
       await userModel.create(req.body);
        res.redirect('/');
    } catch (error) {
        console.error("Insert Error:", error); 
       res.status(500).send('Error inserting student: ' + err.message);
    }
};

exports.Login = async (req, res) => {
    try {

        var singleData = await userModel.find({email:req.body.email});

        if(singleData.length >= 1){
            bcrypt.compare(req.body.password, singleData[0].password, function(err, result) {
                if(result == true){
                    const token = jwt.sign(req.body, 'cdmi', {expiresIn : '1h'});
                    res.status(200).json({ message: "Login successfully",token});
                }else{
                    res.status(200).json({ message: "Invalid Password"});
                }
            });
        }else{
            res.status(200).json({ message: "Email id is wrong..."});    
        }
    } catch (error) {
        console.error("Insert Error:", error); 
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.getData = async (req, res) => {

  try {
    const students = await userModel.find();  // ✅ Data from DB
    res.render('index', { students });   // ✅ EJS को data भेजा
  } catch (error) {
    res.send('Error: ' + error.message);
  }

}

exports.updateData = async (req, res) => {
  const {
    id,
    fullName,
    class: studentClass,
    rollNumber,
    math,
    science,
    english,
    password,
    email
  } = req.body;

  try {
    // Auto calculations
    const totalMarks = Number(math) + Number(science) + Number(english);
    const percentage = totalMarks / 3;
    const resultStatus =
      math >= 35 && science >= 35 && english >= 35 ? "Pass" : "Fail";

    // Update object
    const updateData = {
      fullName,
      class: studentClass,
      rollNumber,
      math,
      science,
      english,
      totalMarks,
      percentage,
      resultStatus,
      email
    };

    // Password optional update
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    await userModel.findByIdAndUpdate(id, updateData, { new: true });

    res.redirect('/');
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).send('Error updating student: ' + err.message);
  }
};

exports.deleteData = async (req, res) => {  
    const { id } = req.body; // सिर्फ id चाहिए delete के लिए

  try {
    await userModel.findByIdAndDelete(id); // ✅ बस id से delete होता है
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting student: ' + err.message);
  }
}



