const userModel = require("../model/usermodel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registration
exports.InsertData = async (req, res) => {
    try {
        // Password hash
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        req.body.password = hashedPassword;
        
        // Create user
        await userModel.create(req.body);
        res.status(201).json({ 
            success: true, 
            message: "User created successfully" 
        });
    } catch (error) {
        console.error("Insert Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error creating user", 
            error: error.message 
        });
    }
};

// User Login
exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Create JWT token
        const tokenPayload = { 
            id: user._id, 
            email: user.email 
        };
        
        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET || 'cdmi', 
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error", 
            error: error.message 
        });
    }
};

// Get all users
exports.getData = async (req, res) => {
    try {
        const users = await userModel.find().select('-password'); // Password exclude
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error("Get Data Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

// For rendering EJS page
exports.student = async (req, res) => {
    try {
        const students = await userModel.find().select('-password');
        res.render('index', { students });
    } catch (error) {
        console.error("Student Page Error:", error);
        res.status(500).send('Error loading page: ' + error.message);
    }
};

// Update user data
exports.updateData = async (req, res) => {
    try {
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

        // Input validation
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Auto calculations for marks
        const mathMarks = Number(math) || 0;
        const scienceMarks = Number(science) || 0;
        const englishMarks = Number(english) || 0;
        
        const totalMarks = mathMarks + scienceMarks + englishMarks;
        const percentage = totalMarks / 3;
        const resultStatus = (mathMarks >= 35 && scienceMarks >= 35 && englishMarks >= 35) 
            ? "Pass" : "Fail";

        // Update object
        const updateData = {
            fullName,
            class: studentClass,
            rollNumber,
            math: mathMarks,
            science: scienceMarks,
            english: englishMarks,
            totalMarks,
            percentage: Math.round(percentage * 100) / 100, // 2 decimal places
            resultStatus,
            email
        };

        // Password optional update
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message
        });
    }
};

// Delete user
exports.deleteData = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

// Alternative insert method for EJS forms
exports.Insert = async (req, res) => {
    try {
        await userModel.create(req.body);
        res.redirect('/');
    } catch (error) {
        console.error("Insert Error:", error);
        res.status(500).send('Error inserting user: ' + error.message);
    }
};

// Alternative update method for EJS forms
exports.Update = async (req, res) => {
    try {
        const { id, name, rollNumber, subject, marks } = req.body;

        if (!id) {
            return res.status(400).send('User ID is required');
        }

        await userModel.findByIdAndUpdate(id, {
            name,
            rollNumber,
            subject,
            marks,
        });
        
        res.redirect('/');
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).send('Error updating user: ' + error.message);
    }
};

// Alternative delete method for EJS forms
exports.Delete = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).send('User ID is required');
        }

        await userModel.findByIdAndDelete(id);
        res.redirect('/');
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).send('Error deleting user: ' + error.message);
    }
};