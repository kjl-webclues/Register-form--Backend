const express = require('express')
const router = express.Router()
const User = require('../model/employee')
// const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticate = require ("../middleware/checkAuth")

router.get('/getUser', async (req, res) => {
    try {
        const userData = await User.find()
        res.send(userData) 
    } catch (err) {
        res.send('Error' + err)
    }
})

//For Register User
router.post('/signUp', async (req, res) => {
    console.log('post method call');
    const user = new User({
        name: req.body.name,
        profession: req.body.profession,
        phone: req.body.phone,
        salary: req.body.salary,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        token: req.body.token
    })
    try {
        const userData = await user.save()
        res.send(userData)
    } catch (err) {
        res.send("Error" + err)
        console.log(err);
    }
})

//for Login User
router.post('/signIn', async (req, res) => {
    // console.log("hello");
    try {
        let token;        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: "please field the data" });            
        }
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            token = await userLogin.generateAuthToken();
            console.log(token);

            //store the token in cookie
            res.cookie("jwtLogin", token, {
                expiresIn: new Date(Date.now() + 1 * 3600 * 1000),
                httpOnly: true
            })
            res.send({ message: "Login Successful" });
        } else {
            console.log("Invalid Credientials!");
            res.status(400).send({ error: "Invalid Credientials!"});
        }

    } catch (err) {
        console.log(err);
    }
})

//for edit
router.get('/editUser/:id', async (req, res) => {
    try {
        const userData = await User.findById(req.params.id)
        res.send(userData)
    } catch (err) {
        res.send('Error' + err)
    }
})

//put (update) for update
router.put('/editUser/:id', async (req, res) => {
    try {
        const employee = await User.findById(req.params.id)
        employee.name = req.body.name
        employee.profession = req.body.profession
        employee.phone = req.body.phone
        employee.salary = req.body.salary
        employee.email = req.body.email
        employee.password = req.body.password
        employee.confirmpassword = req.body.confirmpassword

        const userData = await employee.save()
        res.send(userData)
    } catch (err) {
        res.send('Error' + err)
    }
})

//for Delete User
router.delete('/deleteUser/:id', async (req, res) => {
    try {
    // const employee = await User.findById(req.params.id)
    // const e1 = await employee.remove()
        const employee = await User.findByIdAndRemove(req.params.id)
    res.json(employee)
    } catch (err) {
        res.send('Error' + err)
    }
})

//for dashbord authentication
router.get('/dashbord',authenticate,(req, res) => {
    res.send(req.authenticateUser);
})

router.get('/logout', authenticate, async (req, res) => {
    console.log("hello");
    try {
        //Remove token from database
        
        req.authenticateUser.Token = req.authenticateUser.Token.filter((elem) => {
            return elem.token !== req.token
        })
        console.log(" req.authenticateUser.Token", req.authenticateUser.Token);

        //clear cookie
        res.clearCookie('jwtLogin');
        await req.authenticateUser.save();
        res.status(200).send("user Logout");
    }
    catch (err) {
        console.log('error');
        res.status(500).send(err);
    }
})
module.exports = router



        // "name": "test3",
		// "profession": "job",
		// "salary": 56468,
        // "email": "hdg@hgdfsg",
        // "phone":87698699,
        // "password":"abcdefgh",
        // "confirmpassword":"abcdefgh"        