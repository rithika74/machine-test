const mongoose = require('mongoose')

const profileScheme = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    doj: {
        type: String
    },
    salary: {
        type: String
    },
    image: {
        type: String
    }
})

let Profile = mongoose.model('Profile', profileScheme, 'profile')

module.exports = Profile