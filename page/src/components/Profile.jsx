import React, { useState } from 'react'

const Profile = ({ profile, setIsViewModalOpen }) => {

    return (
        <>

            <div className='profile'>
                <div className='img'>
                    <img src={`http://localhost:5000/uploads/profiles/${profile.image}`} alt="Profile" />
                </div>
                <div className='name'>{profile.fname} {profile.lname}</div>
                <div className='sec1'>
                    <div>{profile.department}</div>
                    <div>{profile.designation}</div>
                </div>
                <div className='sec2'>
                    <div>Department</div>
                    <div>Designation</div>
                </div>
                <div className='sec1'>
                    <div>{profile.doj}</div>
                    <div>${profile.salary}</div>
                </div>
                <div className='sec2'>
                    <div>Date of Joining</div>
                    <div>Salary</div>
                </div>
                <div className='btn' style={{ width: '100px' }}>
                    <button onClick={() => setIsViewModalOpen(false)}>Close</button>
                </div>
            </div>

        </>
    )
}

export default Profile