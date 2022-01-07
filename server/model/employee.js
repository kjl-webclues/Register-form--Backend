const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

//create a schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    profession: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    Token: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

//GENERATE TOKEN
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.Token = this.Token.concat({ token });

        await this.save();
        return token;
    }
    catch (err) {
        console.log(err);
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User
