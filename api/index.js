const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const Profile = require('./model/profile')
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://127.0.0.1:27017/employee')
    .then(() => console.log('Connected!'));

const db = mongoose.connection

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const saltrounds = 10;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname)
    }
});

const upload = multer({ storage: storage });

app.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { fname, lname, department, designation, doj, salary } = req.body;
        const imagePath = req.file ? req.file.filename : '';
        const newUser = new Profile({
            fname: fname,
            lname: lname,
            department: department,
            designation: designation,
            doj: doj,
            salary: salary,
            image: imagePath
        });
        const savedUser = await newUser.save();

        res.json({ message: 'User added successfully', user: savedUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/profiles', async (req, res) => {
    try {
        let profiles = await Profile.find();
        if (profiles.length > 0) {
            const formattedProfiles = profiles.map(profile => {
                return {
                    _id: profile._id,
                    fname: profile.fname,
                    lname: profile.lname,
                    department: profile.department,
                    designation: profile.designation,
                    doj: profile.doj,
                    salary: profile.salary,
                    image: profile.image ? profile.image : null
                };
            });
            res.json(formattedProfiles);
        } else {
            res.json({ result: 'No Profiles Found' });
        }
    } catch (error) {
        console.error('Error retrieving profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/profile/:id', async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        let response = await Profile.findById(id)
        console.log(response);
        res.json(response);
    } catch (error) {
        console.error('Error finding profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


app.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid profile ID' });
        }

        const { fname, lname, department, designation, doj, salary } = req.body;
        const imagePath = req.file ? req.file.filename : undefined;

        let profile = await Profile.findById(id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (fname !== undefined) profile.fname = fname;
        if (lname !== undefined) profile.lname = lname;
        if (department !== undefined) profile.department = department;
        if (designation !== undefined) profile.designation = designation;
        if (doj !== undefined) profile.doj = new Date(doj);
        if (salary !== undefined) profile.salary = salary;

        if (imagePath !== undefined) {
            if (profile.image) {
                const oldImagePath = path.join(__dirname, 'uploads', profile.image);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                    } catch (error) {
                        console.error('Error deleting old image:', error);
                    }
                }
            }
            profile.image = imagePath;
        }

        const updatedProfile = await profile.save();
        res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.image) {
            const imagePath = path.join(__dirname, 'uploads', profile.image);
            fs.unlinkSync(imagePath);
        }
        await Profile.findByIdAndDelete(id);
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});