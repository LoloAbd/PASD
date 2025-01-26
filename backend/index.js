const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Admin = require('./models/Admin');
const models = require('./models/Data');
const {
    Status_Model,
    Usage_Model,
    Countries_Model,
    Cities_Model,
    Addresses_Model,
    bdr_Model,
    Buildings_Model,
    Architects_Model,
    Buildings_Architects_Model,
    Notaries_Model,
    Buildings_Notaries_Model,
    Owners_Model,
    Buildings_Owners_Model,
    Tenants_Model,
    Buildings_Tenants_Model,
    Buildings_Usage_Model,
    Buildings_Status_Model,
    Images_Model

} = models;

const {
  AdminModel,
  Log
} = Admin;
 

require('dotenv').config();

const app = express();
 
// Middleware with increased limit
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
})
  .then(() => console.log('Connected to PASD database'))
  .catch(err => console.error('MongoDB connection error:', err));



const conn = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// insert logs
app.post('/logs', async (req, res) => {
  const { action, details, timestamp, adminUsername } = req.body;
  try {
      const detailsString = typeof details === 'object' ? JSON.stringify(details) : details;

        // Create a new log entry
        const newLog = new Log({
            action,
            details: detailsString,
            timestamp,
            adminUsername
        });

        // Save the log to the database
        await newLog.save();

        res.status(201).send({ message: 'Log saved' });
    } catch (error) {
        console.error("Error saving log:", error);
        res.status(500).send({ message: 'Error saving log' });
    }
});


// get each admin logs

app.get('/logs/:adminUsername', async (req, res) => {
    try {
        const logs = await Log.find({ adminUsername: req.params.adminUsername });
        res.status(200).json(logs); // Send logs for the selected admin
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).send({ message: 'Error fetching logs' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    AdminModel.findOne({ username: username })
        .then(admin => {
            if (admin) {
                if (admin.password === password) {
                res.json("Success")
            } else {
                res.json("username or password incorrect")
            }
            } else {
                res.json("username does not exist")
            }
    })
})

app.post('/addAdmin', async (req, res) => {
    try {
        const { first_name, last_name ,email, username, password} = req.body;

        // Check if an admin with the same username already exists
        const existingAdminusername = await AdminModel.findOne({ username });
        // Check if an admin with the same email already exists
        const existingAdminemail = await AdminModel.findOne({ email });

        // If either username or email already exists, send an error response
        if (existingAdminusername) {
            return res.status(409).json({ message: "Admin with this username already exists." });
        } else if (existingAdminemail) {
            return res.status(409).json({ message: "Admin with this email already exists." });
        }

        // Create and save the new admin (you might want to hash the password here)
        const newAdmin = await AdminModel.create({ first_name, last_name, email, username, password });

        // Return the success response
        res.status(201).json({ message: "Admin created successfully", admins: newAdmin });

    } catch (error) {
        // Catch any other errors that may occur during admin creation
        console.error("Error creating admin:", error);
        return res.status(500).json({ message: "Error creating admin", error });
    }
});




app.get('/admin/:username', (req, res) => {
    const { username } = req.params;
    AdminModel.findOne({ username })
        .then(admin => {
            if (admin) res.json(admin);
            else res.status(404).json({ message: "Admin not found" });
        })
        .catch(err => res.status(500).json(err));
});


app.put('/admin/:username', (req, res) => {
    const { username } = req.params;
    const updates = req.body;
    AdminModel.findOneAndUpdate({ username }, updates, { new: true })
        .then(updatedAdmin => res.json(updatedAdmin))
        .catch(err => res.status(500).json(err));
});

// fetch all admins
app.get('/getAdmins', async (req, res) => {
    try {
        const admins = await AdminModel.find(); // Fetch all admins
        res.status(200).json(admins); // Respond with admins in JSON format
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error });
    }
});

// delete admin by id
app.delete('/deleteAdmin/:adminId', async (req, res) => {
  try {
    const admin = await AdminModel.findByIdAndDelete(req.params.adminId);

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    res.status(200).send({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).send({ message: 'Error deleting admin' });
  }
});

// get all images
app.get("/images", async (req, res) => {
try {
      const images = await Images_Model.find();
      res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Error fetching images" });
  }
});

// insert images
app.post("/add-images", async (req, res) => {
  try {
    const { building_id, Type, description, referenceType, pictureReference, filename } = req.body;

    // Validate required fields
    if (!building_id || !Type || !filename) {
      return res.status(400).json({ message: "Building ID, type, and image URL are required" });
    }

    // Create a new building image
    const newImage = new Images_Model({
      building_id,
      Type,
      description,
      referenceType,
      pictureReference,
      filename,
    });

    // Save the image to the database
    await newImage.save();

    res.status(201).json({ message: "Image added successfully", images: newImage });
  } catch (error) {
    console.error("Error adding image:", error);
    res.status(500).json({ message: "Failed to add image" });
  }
});


// Delete image
app.delete('/delete-image/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the image from the database
        const result = await Images_Model.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});


// Fetch Buildings
app.get('/buildings', async (req, res) => {
  try {
        const buildings = await Buildings_Model.find(); // Fetch all Building
        res.status(200).json(buildings); // Respond with admins in JSON format
  } catch (error) {
      console.error("Error fetching buildings:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//Fetch a Building by ID
app.get('/buildings/:id', async (req, res) => {
  try {
    const building = await Buildings_Model.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }
    res.json(building);
  } catch (error) {
    console.error('Error fetching building:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.get('/addresses/:id', async (req, res) => {
  try {
    const address = await Addresses_Model.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json(address);
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});


// Update Building Endpoint
/*app.put('/update-buildings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid building ID' });
    }

    // Find and update the building
    const updatedBuilding = await Buildings_Model.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    if (!updatedBuilding) {
      return res.status(404).json({ error: 'Building not found' });
    }

    res.status(200).json({ message: 'Building updated successfully', building: updatedBuilding });
  } catch (error) {
    console.error('Error updating building:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/
app.put('/update-buildings/:id', async (req, res) => {
  try {
    const updatedBuilding = await Buildings_Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBuilding) {
      return res.status(404).json({ error: 'Building not found' });
    }
    res.status(200).json(updatedBuilding);
  } catch (error) {
    console.error('Error updating building:', error);
    res.status(500).json({ error: 'Failed to update building' });
  }
});

app.put('/update-addresses/:id', async (req, res) => {
  try {
    const updatedAddress = await Addresses_Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});




// API Endpoint to Fetch Notaries
app.get('/notaries', async (req, res) => {
  try {
        const notaries = await Notaries_Model.find(); 
        res.status(200).json(notaries);
  } catch (error) {
      console.error("Error fetching notaries:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint to Fetch Owners
app.get('/owners', async (req, res) => {
  try {
        const owners = await Owners_Model.find();
        res.status(200).json(owners);
  } catch (error) {
      console.error("Error fetching owners:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint to Fetch Tenant
app.get('/tenants', async (req, res) => {
  try {
        const tenants = await Tenants_Model.find();
        res.status(200).json(tenants);
  } catch (error) {
      console.error("Error fetching tenants:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint to Fetch BDR
app.get('/bdr', async (req, res) => {
  try {
        const bdrs = await bdr_Model.find();
        res.status(200).json(bdrs);
  } catch (error) {
      console.error("Error fetching Building During the Reign:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint to Fetch Countries
app.get("/countries", async (req, res) => {
  try {
    const countries = await Countries_Model.find(); // Fetch only required fields
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching countries" });
  }
});

// Fetch Cities by Country ID
app.get("/cities", async (req, res) => {
  try {
    const { country_id } = req.query;
    if (country_id) {
      const cities = await Cities_Model.find({ country_id });
      res.status(200).json(cities);
    } else {
      res.status(400).json({ message: "country_id is required" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching cities" });
  }
});



// Fetch Cities
app.get("/get-cities", async (req, res) => {
  try {
      const cities = await Cities_Model.find();
      res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cities" });
  }
});


// Fetch Addresses
app.get("/get-addresses", async (req, res) => {
  try {
      const addresses = await Addresses_Model.find();
      res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching addresses" });
  }
});


// Update notary name
app.put('/notaries/:id', async (req, res) => {
    const { id } = req.params;
  const update = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const updatedNotary = await Notaries_Model.findByIdAndUpdate(id, update, { new: true });
        if (!updatedNotary) {
            return res.status(404).json({ message: 'Notary not found' });
        }
        res.status(200).json(updatedNotary);
    } catch (error) {
        console.error('Error updating notary:', error);
        res.status(500).json({ error: 'Error updating notary', error });
    }
});


// Add City
app.post("/add-cities", async (req, res) => {
  try {
    const { city_name, country_id, map } = req.body;

    // Validate required fields
    if (!city_name || !country_id || !map) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new city
    const newCity = new Cities_Model({
      city_name,
      country_id,
      map,
    });

    // Save the city to the database
    await newCity.save();

    res.status(201).json({ message: "City added successfully", cities: newCity });
  } catch (error) {
    console.error("Error adding city:", error);
    res.status(500).json({ message: "Failed to add city" });
  }
});

// Update city
app.put("/update-city/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { city_name, country_id, map } = req.body;

    // Validate required fields
    if (!city_name || !country_id || !map) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the city by ID and update it
    const updatedCity = await Cities_Model.findByIdAndUpdate(
      id,
      { city_name, country_id, map },
      { new: true } // Return the updated document
    );

    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({ message: "City updated successfully", cities: updatedCity });
  } catch (error) {
    console.error("Error updating city:", error);
    res.status(500).json({ message: "Failed to update city" });
  }
});


// fetch all Architects
app.get("/Architects", async (req, res) => {
    try {
        const Architects = await Architects_Model.find(); 
        res.status(200).json(Architects);
    } catch (error) {
        console.error("Error fetching Architects:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// fetch all usage
app.get("/usage", async (req, res) => {
    try {
        const usage = await Usage_Model.find(); 
        res.status(200).json(usage);
    } catch (error) {
        console.error("Error fetching usage:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// fetch all status
app.get("/status", async (req, res) => {
    try {
        const status = await Status_Model.find(); 
        res.status(200).json(status);
    } catch (error) {
        console.error("Error fetching status:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Add building testt
app.post("/AddBuilding", async (req, res) => {
  const { building_name,area, ar_description,en_description, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id} = req.body;

    try {
    const newBuilding = await Buildings_Model.create({building_name,area, ar_description,en_description, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id});
   
    res.status(201).json({ message: "Building added successfully!", buildings: newBuilding});
  } catch (error) {
    res.status(500).json({ error: "Error adding building" });
  }
});



// Add building with a 360 link
app.put('/buildingsThs/:id', async (req, res) => {
  const { id } = req.params;
  const { thsLink} = req.body;

  try {

    const updatedBuilding = await Buildings_Model.findByIdAndUpdate(
      id,
      { thsLink},
      { new: true }
    );

    if (!updatedBuilding) {
      console.error("Building not found with ID:", id);
      return res.status(404).json({ message: 'Building not found' });
    }

    res.status(200).json(updatedBuilding);
  } catch (error) {
    console.error("Error updating building:", error.message);
    res.status(500).json({ message: 'Error updating building', error: error.message });
  }
});



// fetch all Buildings
app.get("/get-buildings", async (req, res) => {
    try {
        const building = await Buildings_Model.find(); 
        res.status(200).json(building);
    } catch (error) {
        console.error("Error fetching building:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.delete("/buildings/:id/:addressId", async (req, res) => {
  try {
    const { id: buildingId, addressId } = req.params;

    // Delete related records
    await Promise.all([
      Buildings_Status_Model.deleteMany({ building_id: buildingId }),
      Buildings_Usage_Model.deleteMany({ building_id: buildingId }),
      Buildings_Architects_Model.deleteMany({ building_id: buildingId }),
      Buildings_Notaries_Model.deleteMany({ building_id: buildingId }),
      Buildings_Owners_Model.deleteMany({ building_id: buildingId }),
      Buildings_Tenants_Model.deleteMany({ building_id: buildingId }),
      Images_Model.deleteMany({ building_id: buildingId }),
    ]);

    console.log("Related records deleted successfully.");

    // Delete the building itself
    const deletedBuilding = await Buildings_Model.findByIdAndDelete(buildingId);
    if (!deletedBuilding) {
      return res.status(404).json({ error: "Building not found" });
    }

    // Delete the related address
    const deletedAddress = await Addresses_Model.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      console.warn("Warning: Address not found or already deleted.");
    } else {
      console.log("Address deleted successfully.");
    }

    res.status(200).json({ message: "Building and related data deleted successfully." });
  } catch (error) {
    console.error("Error deleting building:", error);
    res.status(500).json({ error: "Failed to delete building." });
  }
});



// Add Address
app.post("/AddAddress", async (req, res) => {
  const {city_id, street, coordinates} = req.body;

    try {
    const newAddress = await Addresses_Model.create({city_id, street, coordinates});
   
    res.status(201).json({ message: "Address added successfully!", addresses: newAddress});
  } catch (error) {
    res.status(500).json({ error: "Error adding Address" });
  }
});

// Add buildings_Usages
app.post("/add-building-usage", async (req, res) => {
  const { building_id, usage_id, type } = req.body;

  // Validate the data
  if (!building_id || !usage_id || !type) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Create and save the new usage document
    const newUsage = new Buildings_Usage_Model({ building_id,usage_id,type, });
    await newUsage.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({
      message: "Building usage added successfully!",
      buildings_usages: newUsage,
    });
  } catch (error) {
    console.error("Error adding building usage:", error);
    res.status(500).json({ message: "An error occurred while adding usage." });
  }
});

//Add Buildings_status
app.post("/add-building-status", async (req, res) => {
  const { building_id, status_id } = req.body;

  try {
    // Create and save the new status document
    const newStatus = new Buildings_Status_Model({ building_id, status_id});
    await newStatus.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({
      message: "Building usage added successfully!",
      buildings_status: newStatus,
    });
  } catch (error) {
    console.error("Error adding building status:", error);
    res.status(500).json({ message: "An error occurred while adding status." });
  }
});


//Add Buildings_Architects
app.post("/add-buildings-architects", async (req, res) => {
  const { building_id, architect_id } = req.body;

  try {
    // Create and save the new architects document
    const newArchitects = new Buildings_Architects_Model({ building_id, architect_id});
    await newArchitects.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Architects added successfully!",buildings_architects: newArchitects,});
  } catch (error) {
    console.error("Error adding Buildings_Architects:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Architects." });
  }
});


// Add Architect
app.post('/add-architect', async (req, res) => {
  try {
    const { architect_name, ar_biography, en_biography, filename } = req.body; // Get data from the request body

    // Validate required fields
    if (!architect_name || !ar_biography || !en_biography || !filename) {
      return res.status(400).json({ error: 'All fields are required, including the image URL' });
    }

    // Save architect details in the architects collection
    const architectsDoc = await conn.db.collection('architects').insertOne({
      architect_name,
      ar_biography,
      en_biography,
      filename, // Store the image URL directly
    });

    res.status(200).json({
      message: 'Architect added successfully',
      architect: {
        id: architectsDoc.insertedId,
        architect_name,
        ar_biography,
        en_biography,
        filename,
      },
    });
  } catch (error) {
    console.error('Error saving architect:', error);
    res.status(500).json({ error: 'Failed to add architect' });
  }
});



// Edit Arch
app.put('/architects/:id', async (req, res) => {
  const { id } = req.params;
  const { architect_name, en_biography, ar_biography, filename} = req.body;

  try {

    const updatedArchitect = await Architects_Model.findByIdAndUpdate(
      id,
      { architect_name, ar_biography, en_biography, filename},
      { new: true }
    );

    if (!updatedArchitect) {
      console.error("Architect not found with ID:", id);
      return res.status(404).json({ message: 'Architect not found' });
    }

    res.status(200).json(updatedArchitect);
  } catch (error) {
    console.error("Error updating architect:", error.message);
    res.status(500).json({ message: 'Error updating architect', error: error.message });
  }
});


//Add Notary
app.post("/add-notary", async (req, res) => {
  const { notary_name} = req.body;

  try {
    // Create and save the new notary document
    const newNotary = new Notaries_Model({notary_name});
    await newNotary.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "notary added successfully!", notaries: newNotary,});
  } catch (error) {
    console.error("Error adding notary:", error);
    res.status(500).json({ message: "An error occurred while adding notary." });
  }
});


//Add Buildings_Notaries
app.post("/add-buildings-notaries", async (req, res) => {
  const { building_id, notary_id } = req.body;

  try {
    // Create and save the new notary document
    const newNotary = new Buildings_Notaries_Model({ building_id, notary_id});
    await newNotary.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Notaries added successfully!", buildings_notaries: newNotary,});
  } catch (error) {
    console.error("Error adding Buildings_Notaries:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Notaries." });
  }
});

//Add Buildings_Owners
app.post("/add-buildings-owners", async (req, res) => {
  const { building_id, owner_id } = req.body;

  try {
    // Create and save the new Owners document
    const newOwners = new Buildings_Owners_Model({ building_id, owner_id});
    await newOwners.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Owners added successfully!", buildings_owners: newOwners,});
  } catch (error) {
    console.error("Error adding Buildings_Owners:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Owners." });
  }
});

//Add Owners
app.post("/add-owner", async (req, res) => {
  const { owner_name} = req.body;

  try {
    // Create and save the new notary document
    const newOwner = new Owners_Model({owner_name});
    await newOwner.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "owner added successfully!", owners: newOwner,});
  } catch (error) {
    console.error("Error adding owner:", error);
    res.status(500).json({ message: "An error occurred while adding owner." });
  }
});


//Add Buildings_Tenant
app.post("/add-buildings-tenants", async (req, res) => {
  const { building_id, tenant_id } = req.body;

  try {
    // Create and save the new Tenant document
    const newTenant = new Buildings_Tenants_Model({ building_id, tenant_id});
    await newTenant.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "buildings_tenants added successfully!", buildings_tenants: newTenant,});
  } catch (error) {
    console.error("Error adding buildings_tenants:", error);
    res.status(500).json({ message: "An error occurred while adding buildings_tenants." });
  }
});

//Add Tenant
app.post("/add-tenant", async (req, res) => {
  const { tenant_name} = req.body;

  try {
    // Create and save the new notary document
    const newTenant = new Tenants_Model({tenant_name});
    await newTenant.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Tenant added successfully!", tenants: newTenant,});
  } catch (error) {
    console.error("Error adding Tenant:", error);
    res.status(500).json({ message: "An error occurred while adding Tenant." });
  }
});


app.get('/notaries/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    const notaryBuildings = await Buildings_Notaries_Model.find({ notary_id: id })
      .populate('building_id');

    const buildingsWithDetails = notaryBuildings.map(buildings => {
      if (!buildings.building_id) {
        return null; // Handle missing data
      }
      return {
        building_id: buildings.building_id._id,
        building_name: buildings.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});


app.get('/architects/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    const architectBuildings = await Buildings_Architects_Model.find({ architect_id: id })
      .populate('building_id');


    const buildingsWithDetails = architectBuildings.map(buildings => {
      if (!buildings.building_id) {
        return null; // Handle missing data
      }
      return {
        building_id: buildings.building_id._id,
        building_name: buildings.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});



app.get('/owners/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    const ownerBuildings = await Buildings_Owners_Model.find({ owner_id: id })
      .populate('building_id');

    const buildingsWithDetails = ownerBuildings.map(building => {
      if (!building.building_id) {
        return null; // Handle missing data
      }
      return {
        building_id: building.building_id._id,
        building_name: building.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});


app.get('/tenants/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    const tenantBuildings = await Buildings_Tenants_Model.find({ tenant_id: id })
      .populate('building_id');


    const buildingsWithDetails = tenantBuildings.map(building => {
      if (!building.building_id) {
        return null; // Handle missing data
      }
      return {
        building_id: building.building_id._id,
        building_name: building.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});


// Update tenant by ID
app.put("/tenants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tenant_name } = req.body;

    if (!tenant_name) {
      return res.status(400).json({ error: "Tenant name is required" });
    }

    const tenant = await Tenants_Model.findByIdAndUpdate(
      id,
      { tenant_name },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    res.json(tenant);
  } catch (err) {
    console.error("Error updating tenant:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update owner by ID
app.put("/owners/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_name } = req.body;

    if (!owner_name) {
      return res.status(400).json({ error: "Owner name is required" });
    }

    const owner = await Owners_Model.findByIdAndUpdate(
      id,
      { owner_name },
      { new: true }
    );

    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }

    res.json(owner);
  } catch (err) {
    console.error("Error updating owner:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Update notaries by ID
app.put("/notaries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { notary_name } = req.body;

    if (!notary_name) {
      return res.status(400).json({ error: "Notary name is required" });
    }

    const notary = await Notaries_Model.findByIdAndUpdate(
      id,
      { notary_name },
      { new: true }
    );

    if (!notary) {
      return res.status(404).json({ error: "notary not found" });
    }

    res.json(notary);
  } catch (err) {
    console.error("Error updating notary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/buildings/:id/status', async (req, res) => {
  const { id } = req.params;
  try {

    // Find all statuses related to the given building_id
    const statusBuildings = await Buildings_Status_Model.find({ building_id: id })
      .populate('status_id', 'status_name _id'); // Populate only required fields from the Status collection


    // Map statuses to include the necessary details
    const statusWithDetails = statusBuildings.map(status => {
      if (!status.status_id) {
        return null; // Handle missing data
      }
      return {
        status_id: status.status_id._id, // Use the populated status data
        status_name: status.status_id.status_name,
      };
    }).filter(Boolean); // Remove null entries caused by missing data

    // Send the response
    res.status(200).json(statusWithDetails);

  } catch (error) {
    console.error("Error fetching building statuses:", error);
    res.status(500).json({ error: 'Failed to fetch building statuses' });
  }
});


app.get('/buildings/:id/usage', async (req, res) => {
  const { id } = req.params;
  try {

    // Find all usage related to the given building_id in the Buildings_Usage collection
    const usageBuildings = await Buildings_Usage_Model.find({ building_id: id })
      .populate('usage_id', 'use_type') // Populate the usage_id with the name (use_type) from the Usage collection
      .select('usage_id type'); // Select usage_id and type from Buildings_Usage collection directly

    // Map usage to include the necessary details
    const usageWithDetails = usageBuildings.map(usage => {
      if (!usage.usage_id) {
        return null; // Handle missing data
      }
      return {
        usage_id: usage.usage_id._id, // Use the populated usage data (usage_id)
        usage_name: usage.usage_id.use_type, // Get the use_type (name) from the populated usage_id
        type: usage.type, // Add the type field from Buildings_Usage collection
      };
    }).filter(Boolean); // Remove null entries caused by missing data

    // Send the response
    res.status(200).json(usageWithDetails);

  } catch (error) {
    console.error("Error fetching building usage:", error);
    res.status(500).json({ error: 'Failed to fetch building usage' });
  }
});




app.get('/buildings/:building_id', async (req, res) => {
  try {
    // Find building by building_id from the database
    const building = await Buildings_Model.findOne({ building_id: req.params.building_id });

    if (building) {
      res.json(building);  // Return building data if found
    } else {
      res.status(404).json({ message: 'Building not found' });  // Return error if not found
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


app.get('/buildings/:building_id/images', async (req, res) => {
  try {
    // Find images related to the building by building_id from the database
    const buildingImages = await Images_Model.find({ building_id: req.params.building_id });

    if (buildingImages.length > 0) {
      res.json(buildingImages);  // Return image data if images found
    } else {
      res.status(404).json({ message: 'Images not found' });  // Return error if no images are found
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Server setup
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});