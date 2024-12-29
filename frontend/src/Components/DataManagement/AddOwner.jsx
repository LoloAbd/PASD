import React, { useState } from 'react';
import axios from 'axios';
import { GoPersonFill } from "react-icons/go";
import Owners from './Owners';

const AddOwner = () => { 
    const [owner_name, setOwners_name] = useState() 
    const [formVisible, setFormVisible] = useState(true);

    const handleSubmit = (e) => {
    e.preventDefault();

    // Make the API call to add a new admin
        axios.post('http://localhost:3001/add-owner', { owner_name})
            .then(res => {
                console.log(res);
                alert("Owner Inserted Successfully");
                setFormVisible(false);
            })
            .catch(err => {
                console.error("Error inserting Owner:", err);
            });
    };

    if (!formVisible) {
        return <Owners />;
    }

    return (
        <div className='AddAdminHome'>
            <div className="AddAdminWrapper">

                <div className="AddAdminFormBox">
                    <h2 className="AddAdminTitle">Add New Owner</h2>
                    <form onSubmit={handleSubmit}>

                         <div className="AddAdminInputBox">
                            <input type="text" name='notary_name' onChange={(e) => setOwners_name(e.target.value)} required />
                            <label>Owner Name</label>
                            <GoPersonFill  className='icon'/>
                        </div>
                        <button type="submit" className="AddAdminBtn">Add Owner</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddOwner;
