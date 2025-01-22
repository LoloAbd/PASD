import React, { useState, useEffect } from "react";
import axios from "axios"; // Promise-Based HTTP Client for JavaScript used to make HTTP requests
import "./AddBuildings.css";
import ReactSelect from "react-select";
import { useNavigate } from 'react-router-dom'; // to navigate between routes in our app.
import logAction from "../../logAction";



const AddBuildings = () => {

 const navigate = useNavigate();

  const [building_name, setBuildingName] = useState(""); // use useState to set var and function to update it with initial value null or ""
  const [bdr_id, setBdrId] = useState("");
  const [dateOfConstruction, setDateOfConstruction] = useState("");
  const [documentationDate, setDocumentationDate] = useState("");
  const [area, setArea] = useState("");
  const [en_description, setEn_description] = useState("");
  const [ar_description, setAr_description] = useState("");
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
  const [originalUsageArray, setOriginalUsageArray] = useState([]);
  const [currentUsageArray, setCurrentUsageArray] = useState([]);
  const [statusArray, setStatusArray] = useState([]);
  const [ownerArray, setOwnerArray] = useState([]);
  const [notaryArray, setNotaryArray] = useState([]);
  const [architectArray, setArchitectArray] = useState([]);
  const [tenantArray, setTenantArray] = useState([]);

  const Back = () => {
    // Navigates to the 'ShowBuildings' page
    navigate('/ShowBuildings');
  };

  const handleOwChange = (selectedOwOption) => {
      // Maps selected owner options to an array of objects, each containing building_id and owner_id
      const formattedData = selectedOwOption.map((option) => ({
        building_id: localStorage.getItem('building_id'), // Retrieves the building ID from localStorage
        owner_id: option.value, // Assigns the selected owner's ID
      }));
      setOwnerArray(formattedData); // Updates the state with the formatted owner data
  };

  const handleTeChange = (selectedTeOption) => {
      // Maps selected tenant options to an array of objects, each containing building_id and tenant_id
      const formattedData = selectedTeOption.map((option) => ({
        building_id: localStorage.getItem('building_id'), // Retrieves the building ID from localStorage
        tenant_id: option.value, // Assigns the selected tenant's ID
      }));
      setTenantArray(formattedData); // Updates the state with the formatted tenant data
  };

  const handleNoChange = (selectedNoOption) => {
      // Maps selected notary options to an array of objects, each containing building_id, building_name, and notary_id
      const formattedData = selectedNoOption.map((option) => ({
        building_id: localStorage.getItem('building_id'), // Retrieves the building ID from localStorage
        building_name: building_name, // Uses the current building name
        notary_id: option.value, // Assigns the selected notary's ID
      }));
      setNotaryArray(formattedData); // Updates the state with the formatted notary data
  };

  const handleArChange = (selectedArOption) => {
      // Maps selected architect options to an array of objects, each containing building_id and architect_id
      const formattedData = selectedArOption.map((option) => ({
        building_id: localStorage.getItem('building_id'), // Retrieves the building ID from localStorage
        architect_id: option.value, // Assigns the selected architect's ID
      }));
      setArchitectArray(formattedData); // Updates the state with the formatted architect data
  };

  const handleOrChange = (selectedOrOption) => {
      // Maps selected original usage options to an array of objects, each containing building_id, usage_id, and type
      const formattedData = selectedOrOption.map((option) => ({
        building_id: localStorage.getItem('building_id'), // Retrieves the building ID from localStorage
        usage_id: option.value, // Assigns the selected usage ID
        type: "original", // Sets the type to "original" usage
      }));
      setOriginalUsageArray(formattedData); // Updates the state with the formatted original usage data
  };

  const handleCuChange = (selectedCuOption) => {
      // Maps selected current usage options to an array of objects, each containing building_id, usage_id, and type
      const formattedData = selectedCuOption.map((option) => ({
        building_id: localStorage.getItem('building_id'), // Retrieves the building ID from localStorage
        usage_id: option.value, // Assigns the selected usage ID
        type: "current", // Sets the type to "current" usage
      }));
      setCurrentUsageArray(formattedData); // Updates the state with the formatted current usage data
  }; //setStatusArray



  const handleSChange = (selectedSOption) => {
    const formattedData = selectedSOption.map((option) => ({
      building_id: localStorage.getItem('building_id'),  // Retrieves the building ID from localStorage
      status_id: option.value // Assigns the selected status ID
    }));
    setStatusArray(formattedData); // Updates the state with the formatted status data
    
  };


  const addUsageToBackend = async (usage) => {
      try {
          const { building_id, usage_id, type } = usage;
          // Sends a POST request to add usage data for a building
          await axios.post("http://localhost:3001/add-building-usage", { building_id, usage_id, type });
      } catch (error) {
          console.error("Error adding usage:", error);
          alert("Failed to add usage. Please try again.");
      }
  };

  const addStatusToBackend = async (status) => {
      try {
          const { building_id, status_id } = status;
          // Sends a POST request to add status data for a building
          await axios.post("http://localhost:3001/add-building-status", { building_id, status_id });
      } catch (error) {
          console.error("Error adding status:", error);
          alert("Failed to add status. Please try again.");
      }
  };

  const addArchitectsToBackend = async (architect) => {
      try {
          const { building_id, architect_id } = architect;
          // Sends a POST request to add architect data for a building
          await axios.post("http://localhost:3001/add-buildings-architects", { building_id, architect_id });
      } catch (error) {
          console.error("Error adding architects:", error);
          alert("Failed to add architects. Please try again.");
      }
  };

  const addNotariesToBackend = async (notary) => {
      try {
          const { building_id, notary_id, building_name } = notary;
          // Sends a POST request to add notary data for a building
          await axios.post("http://localhost:3001/add-buildings-notaries", { building_id, notary_id, building_name });
      } catch (error) {
          console.error("Error adding notary:", error);
          alert("Failed to add notary. Please try again.");
      }
  };

  const addTenantsToBackend = async (tenant) => {
      try {
          const { building_id, tenant_id } = tenant;
          // Sends a POST request to add tenant data for a building
          await axios.post("http://localhost:3001/add-buildings-tenants", { building_id, tenant_id });
      } catch (error) {
          console.error("Error adding tenant:", error);
          alert("Failed to add tenant. Please try again.");
      }
  };

  const addOwnersToBackend = async (owner) => {
      try {
          const { building_id, owner_id } = owner;
          // Sends a POST request to add owner data for a building
          await axios.post("http://localhost:3001/add-buildings-owners", { building_id, owner_id });
      } catch (error) {
          console.error("Error adding owner:", error);
          alert("Failed to add owner. Please try again.");
      }
  };

  

  const handleSubmit = async (e) => {
  e.preventDefault(); // Prevents the default form submission behavior to avoid page reload

  try {
    const addressResponse = await axios.post("http://localhost:3001/AddAddress", {
      city_id,
      street,
      coordinates,
    });

    if (addressResponse.status === 201) {
      const { addresses } = addressResponse.data;
      const address_id = addresses._id;
      localStorage.setItem('address_id', address_id);

      const buildingResponse = await axios.post("http://localhost:3001/AddBuilding", {
        building_name,
        area,
        en_description,
        ar_description,
        dateOfConstruction,
        documentationDate,
        numberOfFloors,
        bdr_id,
        address_id
      });

      if (buildingResponse.status === 201) {
        const { buildings } = buildingResponse.data;
        const building_id = buildings._id;
        localStorage.setItem('building_id', building_id);

        for (const usage of originalUsageArray) {
          await addUsageToBackend({ ...usage, building_id });
        }
        for (const usage of currentUsageArray) {
          await addUsageToBackend({ ...usage, building_id });
        }
        for (const status of statusArray) {
          await addStatusToBackend({ ...status, building_id });
        }
        for (const architect of architectArray) {
          await addArchitectsToBackend({ ...architect, building_id });
        }
        for (const notary of notaryArray) {
          await addNotariesToBackend({ ...notary, building_id });
        }
        for (const tenant of tenantArray) {
          await addTenantsToBackend({ ...tenant, building_id });
        }
        for (const owner of ownerArray) {
          await addOwnersToBackend({ ...owner, building_id });
        }

        alert("Building and related data added successfully!");
        navigate('/ShowBuildings');
        logAction("Add Building", building_name);

      }
    }
  } catch (error) {
    console.error("Error during submission:", error);
    alert("Failed to submit data. Please try again.");
  }
};

  
   // Fetch all status
  useEffect(() => {
    axios.get("http://localhost:3001/status") // make an HTTP GET request to the URL.
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
              <input type="text" name="building_name" onChange={(e) => setBuildingName(e.target.value)} required/>
            </div>

            
            <label className="add-building-label">Architect Name</label>

            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={architects.map((architect) => ({
                  value: architect._id, // Architect ID (Used Internally)
                  label:architect.architect_name // Architect Name (Displayed)
                }))}
                isMulti={true}
                onChange={handleArChange} // Calls handleArChange when selection changes
                placeholder="Select Architect Name"
              />
            </div>

            <label className="add-building-label">Owner Name</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={owners.map((owner) => ({
                  value: owner._id, // Owner ID (Used Internally)
                  label:owner.owner_name // Owner Name (Displayed)
                }))}
                isMulti={true}
                onChange={handleOwChange}
                placeholder="Select Owner Name"
              />
            </div>

             <label className="add-building-label">Tenant Name</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={tenants.map((tenant) => ({
                  value: tenant._id, // Tenant ID (Used Internally)
                  label:tenant.tenant_name // Tenant Name (Displayed)
                }))}
                isMulti={true}
                onChange={handleTeChange}
                placeholder="Select Tenant Name"
              />
            </div>
            
            <label className="add-building-label">Notary Name</label>

            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={notaries.map((notary) => ({
                  value: notary._id, // Notary ID (Used Internally)
                  label:notary.notary_name // Notary Name (Displayed)
                }))}
                isMulti={true}
                onChange={handleNoChange}
                placeholder="Select Notary Name"
              />
            </div>
          </div>

          {/* Box 2 */}
          <div className="form-box">

            <label className="add-building-label">Area (in square meters)</label>
            <div className="form-group">
              <input type="number" name="area" onChange={(e) => setArea(e.target.value)} min="1" required/>
            </div>

            <label className="add-building-label">Number of Floors</label>
            <div className="form-group">
              <input type="number" name="numberOfFloors" onChange={(e) => setNumberOfFloors(e.target.value)} min="1" required/>
            </div>
          
            <label className="add-building-label" >Building Description in English</label>
            <div className="form-group">
              <textarea name="en_description" onChange={(e) => setEn_description(e.target.value)} required/>
            </div>

             <label className="add-building-label" >Building Description in Arabic</label>
            <div className="form-group">
              <textarea name="ar_description" onChange={(e) => setAr_description(e.target.value)} required/>
            </div>

               <label className="add-building-label">Date of Construction</label>
            <div className="form-group">
              <input type="number" name="dateOfConstruction" onChange={(e) => setDateOfConstruction(e.target.value)} min="1900" required/>
            </div>


            <label className="add-building-label">Documentation Date</label>
            <div className="form-group">
              <input type="number" name="documentationDate" onChange={(e) => setDocumentationDate(e.target.value)} min="2022" required/>
            </div>
            
          </div>

          {/* Box 3 */}
            <div className="form-box">
          

            <label className="add-building-label">Building During the Reign</label>
            <div className="form-group">
              <select name="bdr_id" value={bdr_id} onChange={(e) => setBdrId(e.target.value)} required>
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

            
             <label className="add-building-label">Status</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={status.map((status) => ({
                  value: status._id,
                  label: status.status_name,
                }))}
                isMulti={true}
                onChange={handleSChange}
                placeholder="Select Status"
              />
            </div>


            <label className="add-building-label">Original Usage</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={originalUsage.map((usage) => ({
                  value: usage._id,
                  label:usage.use_type
                }))}
                isMulti={true}
                onChange={handleOrChange}
                placeholder="Select Original Usage"
              />
            </div>

            <label className="add-building-label">Current Usage</label>
              <div className="form-group">
                <ReactSelect
                  className="ReactSelect"
                  options={currentUsage.map((usage) => ({
                    value: usage._id,
                    label:usage.use_type
                  }))}
                  isMulti={true}
                  onChange={handleCuChange}
                  placeholder="Select Current Usage"
                />
              </div>
            
          </div>

          {/* Box 4 */}
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
            </div>

            <label className="add-building-label">Street</label>
            <div className="form-group">
              <input type="text" name="street" onChange={(e) => setStreet(e.target.value)} required/>
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

            <button type="submit" className="submit-button">Add Building</button>
            <button className="submit-button " style={{marginLeft : "20px"}} onClick={Back} > Back to Buildings </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBuildings;