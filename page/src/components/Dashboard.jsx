import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Modal from 'react-modal';
import Card from 'react-bootstrap/Card';
import Profile from './Profile';
import { FaUserEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const Dashboard = ({ id }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const handleViewProfile = (profile) => {
        setSelectedProfile(profile);
        setIsViewModalOpen(true);
    };


    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

    const [data, setData] = useState({
        fname: '',
        lname: '',
        department: '',
        designation: '',
        doj: '',
        salary: ''
    });
    const [image, setImage] = useState('')

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    console.log(image);
    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        try {
            const userId = localStorage.getItem('id');
            console.log(userId);
            const postData = {
                ...data,
                user: userId
            };

            const formData = new FormData();

            formData.append('fname', postData.fname);
            formData.append('lname', postData.lname);
            formData.append('department', postData.department);
            formData.append('designation', postData.designation);
            formData.append('doj', postData.doj);
            formData.append('salary', postData.salary);
            formData.append('image', image);
            formData.append('user', userId);

            let response = await axios.post('http://localhost:5000/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("Response:", response.data);
            if (response.data) {
                toast.success('User added Successfully');
                setData({
                    fname: '',
                    lname: '',
                    department: '',
                    designation: '',
                    doj: '',
                    salary: ''
                });
                setImage('');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Error adding user');
        }
    };


    const [profiles, setProfiles] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const getProfiles = async () => {
            try {
                let response = await axios.get('http://localhost:5000/profiles');
                console.log(response.data);
                setProfiles(response.data);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };
        getProfiles();
    }, []);

    // const { id } = useParams()
    const [profile, setProfile] = useState({});
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        department: '',
        designation: '',
        doj: '',
        salary: '',
        image: null
    });

    useEffect(() => {
        let fetchdata = async () => {
            try {
                let response = await axios.get(`http://localhost:5000/profile/${id}`);
                console.log(response.data);
                setProfile(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        fetchdata();
    }, [id]);
    console.log("sjih", profile);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('fname', formData.fname);
        formDataToSend.append('lname', formData.lname);
        formDataToSend.append('department', formData.department);
        formDataToSend.append('designation', formData.designation);
        formDataToSend.append('doj', formData.doj);
        formDataToSend.append('salary', formData.salary);
        formDataToSend.append('image', formData.image);

        try {
            const response = await axios.put(`http://localhost:5000/update/${id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log("Updated profile:", response.data);
            toast.success('Profile updated successfully');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        }
    };



    const handleDelete = async (id) => {
        console.log(id);
        const confirm = window.confirm('Are you sure you want to delete')
        try {
            if (confirm) {
                setRefresh(!refresh);
                let response = await axios.delete(`http://localhost:5000/delete/${id}`);
                console.log(response);
                window.location.reload();
            }
        } catch (error) {
            console.log('Error deleting profile');
        }
    };


    const modalStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            position: 'relative',
            background: 'white',
            borderRadius: '10px',
            width: '50%',
            maxWidth: '600px',
            padding: '30px',
            boxSizing: 'border-box',
            overflow: 'auto',
            backgroundColor: '#f3f3f3',
        },
    };
    return (
        <>

            <div className='add'>
                <div onClick={() => setIsAddModalOpen(true)}><FaPlus /></div>
                <Modal
                    isOpen={isAddModalOpen}
                    onRequestClose={() => setIsAddModalOpen(false)}
                    style={modalStyles}
                >
                    <form action="" >
                        <input type="text" name="fname" id="fname" placeholder='First Name' onChange={handleChange} value={data.fname ? data.fname : ''} />
                        <input type="text" name="lname" id="lname" placeholder='Last Name' onChange={handleChange} value={data.lname ? data.lname : ''} />
                        <input type="text" name="department" id="department" placeholder='Department' onChange={handleChange} value={data.department ? data.department : ''} />
                        <input type="text" name="designation" id="designation" placeholder='Designation' onChange={handleChange} value={data.designation ? data.designation : ''} />
                        <input type="date" name="doj" id="doj" placeholder='Date of Joining' onChange={handleChange} value={data.doj ? data.doj : ''} />
                        <input type="text" name="salary" id="salary" placeholder='Salary' onChange={handleChange} value={data.salary ? data.salary : ''} />
                        <input type="file" name="pfp" id="pfp" onChange={handleImageChange} />
                        <div className='btns'>
                            <button style={{ backgroundColor: 'red' }} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                            <button style={{ backgroundColor: '#007bff' }} onClick={handleCreateSubmit}>Create</button>
                        </div>
                    </form>
                </Modal>
            </div>

            <section style={{ marginTop: '50px' }} className='d-flex justify-content-center'>
                <div className='profiles' style={{ gap: '10px' }}>
                    {profiles.length > 0 ? (
                        profiles.map(item => (
                            <div key={item._id} className='profiles'>
                                <Card style={{ cursor: 'pointer' }} className='card' >
                                    <div className='img'>
                                        <img src={`http://localhost:5000/uploads/profiles/${item.image}`} alt="jpg" />
                                    </div>
                                    <Card.Body>
                                        <Card.Title>
                                            <div className='name'>{item.fname} {item.lname}</div>
                                        </Card.Title>
                                        <Card.Text>
                                            <div className='icons'>
                                                <div id='edit' onClick={() => setIsEditModalOpen(true)}><FaUserEdit /></div>
                                                <Modal
                                                    isOpen={isEditModalOpen}
                                                    onRequestClose={() => setIsEditModalOpen(false)}
                                                    style={modalStyles}
                                                >
                                                    <form action="" onSubmit={handleUpdate}>
                                                        <input type="text" name="fname" id="fname" placeholder='First Name' value={formData.fname} onChange={handleInputChange} />
                                                        <input type="text" name="lname" id="lname" placeholder='Last Name' value={formData.lname} onChange={handleInputChange} />
                                                        <input type="text" name="department" id="department" placeholder='Department' value={formData.department} onChange={handleInputChange} />
                                                        <input type="text" name="designation" id="designation" placeholder='Designation' value={formData.designation} onChange={handleInputChange} />
                                                        <input type="date" name="doj" id="doj" placeholder='Date of Joining' value={formData.doj} onChange={handleInputChange} />
                                                        <input type="text" name="salary" id="salary" placeholder='Salary' value={formData.salary} onChange={handleInputChange} />
                                                        <input type="file" name="pfp" id="pfp" onChange={handleFileChange} />
                                                        <div className='btns'>
                                                            <button style={{ backgroundColor: 'red' }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                                            <button style={{ backgroundColor: '#007bff' }} type='submit' >Edit</button>
                                                        </div>
                                                    </form>
                                                </Modal>

                                                <div id='view' onClick={() => handleViewProfile(item)}><FaEye /></div>
                                                <Modal
                                                    isOpen={isViewModalOpen}
                                                    onRequestClose={() => setIsViewModalOpen(false)}
                                                    style={modalStyles}
                                                >
                                                    <Profile
                                                        profile={selectedProfile}
                                                        setIsViewModalOpen={setIsViewModalOpen}
                                                    />
                                                </Modal>


                                                <div id='delete' onClick={() => handleDelete(item._id)}><RiDeleteBin6Fill /></div>
                                            </div>
                                        </Card.Text>
                                        <Card.Text>
                                            <div className='sec1'>
                                                <div>{item.department}</div>
                                                <div>{item.designation}</div>
                                            </div>
                                            <div className='sec2'>
                                                <div>Department</div>
                                                <div>Designation</div>
                                            </div>
                                        </Card.Text>
                                        <Card.Text>
                                            <div className='sec1'>
                                                <div>{item.doj}</div>
                                                <div>${item.salary}</div>
                                            </div>
                                            <div className='sec2'>
                                                <div>Date of Joining</div>
                                                <div>Salary</div>
                                            </div>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div style={{ fontSize: '28px', color: 'gainsboro', fontWeight: 'bold' }}>No Profile Found</div>
                    )}

                </div>
            </section>

            <ToastContainer />

        </>
    )
}

export default Dashboard