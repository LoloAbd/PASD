import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddBuildings.css";
import ReactSelect from "react-select";


const AddBuildings = () => {
  const [building_name, setBuildingName] = useState("");
  const [architect_id, setArchitectId] = useState("");
  const [owner_id, setOwnerId] = useState("");
  const [tenant_id, setTenantId] = useState("");
  const [notary_id, setNotaryId] = useState("");
  const [bdr_id, setBdrId] = useState("");
  const [dateOfConstruction, setDateOfConstruction] = useState("");
  const [documentationDate, setDocumentationDate] = useState("");
  const [area, setArea] = useState("");
  const [thsLink, setThsLink] = useState("");
  const [ar_description, setAr_description] = useState("");
  const [en_description, setEn_description] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [street, setStreet] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [country_id, setCountryId] = useState("");
  const [city_id, setCityId] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [architects, setArchitects] = useState([]);
  const [owners, setOwners] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [notaries, setNotaries] = useState([]);
  const [bdrs, setBDRs] = useState([]);
  const [originalUsage, setOriginalUsage] = useState([]);
  const [currentUsage, setCurrentUsage] = useState([]);
  const [status, setStatus] = useState([]);
  



  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
      const response = await axios.post("http://localhost:3001/AddAddress", {city_id, street, coordinates,});

      if (response.status === 201) {
        const { addresses } = response.data; // Get the address object
        const address_id = addresses._id; // Extract the address ID
        
        // Save the address ID to local storage
        localStorage.setItem('address_id', address_id);

        alert(`Address added successfully! Address ID: ${address_id}`);
        
        try {
          const address_id = localStorage.getItem('address_id');
          const response = await axios.post("http://localhost:3001/AddBuilding", {building_name,area, ar_description,en_description,thsLink, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id}); // Corrected URL
          if (response.status === 201) {
          alert("Building added successfully!");
          }
          
        } catch (error) {
          console.error("Error adding city:", error);
          alert("Failed to add building. Please try again.");
        }
        
    }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address. Please try again.");
    }
    };

  const handleChange = (selectedOption) => {
    console.log("Selected:", selectedOption);
    
  };

   // Fetch all status
  useEffect(() => {
    axios.get("http://localhost:3001/status") 
      .then((res) => {
        setStatus(res.data); // Save the fetched data in the state
        
      })
      .catch((err) => { console.error("Error fetching usage:", err);});
  }, []);

  // Fetch all usage
  useEffect(() => {
    axios.get("http://localhost:3001/usage") 
      .then((res) => {
        setOriginalUsage(res.data); // Save the fetched data in the state
        setCurrentUsage(res.data);
      })
      .catch((err) => { console.error("Error fetching usage:", err);});
  }, []);

  // Fetch all countries
  useEffect(() => {
    axios.get("http://localhost:3001/countries") 
      .then((res) => {
        setCountries(res.data); // Save the fetched data in the state
      })
      .catch((err) => { console.error("Error fetching countries:", err);});
    }, []);

  // Fetch cities whenever the selected country_id changes
  useEffect(() => {
    if (country_id) {
      axios.get(`http://localhost:3001/cities?country_id=${country_id}`)
        .then((res) => {setCities(res.data); })
        .catch((err) => {console.error("Error fetching cities:", err); });
    } else {
      setCities([]); // Clear cities if no country is selected
    }
  }, [country_id]);


  // Fetch all Architects
  useEffect(() => {
    axios.get("http://localhost:3001/Architects")
      .then((res) => {setArchitects(res.data); // Save the fetched data in the state
      })
      .catch((err) => {console.error("Error fetching Architects:", err);});
  }, []);

  // Fetch all Owners
  useEffect(() => {
    axios.get("http://localhost:3001/owners")
      .then((res) => {setOwners(res.data); // Save the fetched data in the state
      })
      .catch((err) => {console.error("Error fetching Owners:", err);});
    }, []);

  // Fetch all Tenants
  useEffect(() => {
    axios.get("http://localhost:3001/tenants")
      .then((res) => {setTenants(res.data); // Save the fetched data in the state
      })
      .catch((err) => { console.error("Error fetching tenants:", err);});
  }, []);

  // Fetch all Notaries
  useEffect(() => {
    axios.get("http://localhost:3001/notaries")
      .then((res) => {setNotaries(res.data); // Save the fetched data in the state
      })
      .catch((err) => { console.error("Error fetching notaries:", err);});
  }, []);


  // Fetch all BDRs
  useEffect(() => {
    axios.get("http://localhost:3001/bdr")
      .then((res) => {setBDRs(res.data); // Save the fetched data in the state
      })
      .catch((err) => { console.error("Error fetching BDRs:", err);});
  }, []);



  return (
    <div className="add-building-container">
      <h1 className="add_Buildings_h">Add Building</h1>
      

      <form className="add-building-form" onSubmit={handleSubmit}>
        <div className="form-boxes">
          {/* Box 1 */}
          <div className="form-box">
            <label className="add-building-label">Building Name</label>
            <div className="form-group">
              <input type="text" name="building_name" onChange={(e) => setBuildingName(e.target.value)}/>
            </div>

            
            <label className="add-building-label">Architect Name</label>
            <div className="form-group">
              <select name="architect_id" value={architect_id} onChange={(e) => setArchitectId(e.target.value)}>
                <option value="">
                  Select Architect
                </option>
                {architects.map((architect) => (
                  <option key={architect._id} value={architect._id}>
                    {architect.architect_name}
                  </option>
                ))}
              </select>
              <button className="add">+</button>
            </div>

            <label className="add-building-label">Owner Name</label>
            <div className="form-group">
              <select name="owner_id" value={owner_id} onChange={(e) => setOwnerId(e.target.value)}>
                <option value="">
                  Select Owner
                </option>
                {owners.map((owner) => (
                  <option key={owner._id} value={owner._id}>
                    {owner.owner_name}
                  </option>
                ))}
              </select>
              <button className="add">+</button>
            </div>

             <label className="add-building-label">Tenant Name</label>
            <div className="form-group">
              <select name="tenant_id" value={tenant_id} onChange={(e) => setTenantId(e.target.value)}>
                <option value="">
                  Select Tenant
                </option>
                {tenants.map((tenant) => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.tenant_name}
                  </option>
                ))}
              </select>
              <button className="add">+</button>
            </div>
            
            <label className="add-building-label">Notary Name</label>
            <div className="form-group">
              <select name="notary_id" value={notary_id} onChange={(e) => setNotaryId(e.target.value)}>
                <option value="">
                  Select Notary
                </option>
                {notaries.map((notarie) => (
                  <option key={notarie._id} value={notarie._id}>
                    {notarie.notary_name}
                  </option>
                ))}
              </select>
              <button className="add">+</button>
            </div>
          </div>

          {/* Box 2 */}
          <div className="form-box">

            <label className="add-building-label">Country</label>
            <div className="form-group">
              <select name="country_id"
                value={country_id}
                onChange={(e) => setCountryId(e.target.value)}>
               <option value="" disabled>
                  Select a Country
                </option>
                {countries.map((country) => (
                  <option key={country._id} value={country._id}>
                    {country.country_name}
                  </option>
                ))}
              </select>
            </div>

            <label className="add-building-label">City</label>
            <div className="form-group">
              <select name="city_name" value={city_id} onChange={(e) => setCityId(e.target.value)}>
                <option value="">
                  Select City
                </option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
              <button className="add">+</button>
            </div>

            <label className="add-building-label">Street</label>
            <div className="form-group">
              <input type="text" name="street" onChange={(e) => setStreet(e.target.value)}/>
            </div>

            <label className="add-building-label">Coordinates</label>
            <div className="form-group">
              <input
                  type="text"
                  name="coordinates"
                  placeholder="latitude, longitude"
                  onChange={(e) => {
                    const value = e.target.value;
                    const coords = value.split(",").map((coord) => parseFloat(coord.trim()));
                      setCoordinates(coords);
                  }}
                />
            </div>
          </div>

          {/* Box 3 */}
          <div className="form-box">
           
            <label className="add-building-label">Date of Construction</label>
            <div className="form-group">
              <input type="number" name="dateOfConstruction" onChange={(e) => setDateOfConstruction(e.target.value)} min="1900" />
            </div>


            <label className="add-building-label">Documentation Date</label>
            <div className="form-group">
              <input type="number" name="documentationDate" onChange={(e) => setDocumentationDate(e.target.value)} min="2022"/>
            </div>

            <label className="add-building-label">Building During the Reign</label>
            <div className="form-group">
              <select name="bdr_id" value={bdr_id} onChange={(e) => setBdrId(e.target.value)}>
                <option value="">
                  Select Reign
                </option>
                {bdrs.map((bdr) => (
                  <option key={bdr._id} value={bdr._id}>
                    {bdr.bdr_name}
                  </option>
                ))}
              </select>
            </div>


            <label className="add-building-label">Original Usage</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={originalUsage.map((usage) => ({
                  value: usage._id,
                  label: usage.use_type,
                }))}
                isMulti={true}
                onChange={handleChange}
                placeholder="Select Original Usage"
              />
            </div>

            <label className="add-building-label">Current Usage</label>
              <div className="form-group">
                <ReactSelect
                  className="ReactSelect"
                  options={currentUsage.map((usage) => ({
                    value: usage._id,
                    label: usage.use_type,
                  }))}
                  isMulti={true}
                  onChange={handleChange}
                  placeholder="Select Current Usage"
                />
              </div>

            <label className="add-building-label">Status</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={status.map((status) => ({
                  value: status._id,
                  label: status.status_name,
                }))}
                isMulti={true}
                onChange={handleChange}
                placeholder="Select Status"
              />
            </div>
            
          </div>

          {/* Box 4 */}
          <div className="form-box">

          <label className="add-building-label">Area (in square meters)</label>
            <div className="form-group">
              <input type="number" name="area" onChange={(e) => setArea(e.target.value)} min="1"/>
            </div>

            <label className="add-building-label">Number of Floors</label>
            <div className="form-group">
              <input type="number" name="numberOfFloors" onChange={(e) => setNumberOfFloors(e.target.value)} min="1"/>
            </div>

            <label className="add-building-label">Front Image Link</label>
            <div className="form-group">
              <input type="text" name="frontImageLink" />
            </div>

            <label className="add-building-label" >360 View Link</label>
            <div className="form-group">
              <input type="text" name="thsLink" onChange={(e) => setThsLink(e.target.value)}/>
            </div>

            <label className="add-building-label" >Building Description in Arabic</label>
            <div className="form-group">
              <textarea name="ar_description" onChange={(e) => setAr_description(e.target.value)}/>
            </div>

            <label className="add-building-label" >Building Description in English</label>
            <div className="form-group">
              <textarea name="en_description" onChange={(e) => setEn_description(e.target.value)} />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Add Building
        </button>
      </form>
    </div>
  );
};

export default AddBuildings;