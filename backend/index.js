const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AdminModel = require('./models/Admin');
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
    Buildings_Usage_Model

 } = models;

const app = express();
 
// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://alaaalqader:mmmmfCtCqZKoeriQ@cluster0.dndrd.mongodb.net/PASD?retryWrites=true&w=majority", {
    dbName: 'PASD'
})
.then(() => console.log('Connected to PASD database'))
.catch(err => console.error('MongoDB connection error:', err));


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

// API Endpoint to Fetch Buildings
app.get('/buildings', async (req, res) => {
  try {
        const buildings = await Buildings_Model.find(); // Fetch all Building
        res.status(200).json(buildings); // Respond with admins in JSON format
  } catch (error) {
      console.error("Error fetching buildings:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
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

app.delete('/notaries/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const deletedNotary = await Notaries_Model.findByIdAndDelete(id);
        if (!deletedNotary) {
            return res.status(404).json({ message: 'Notary not found' });
        }
        res.json({ message: 'Notary deleted successfully' });
    } catch (error) {
        console.error('Error deleting notary:', error);
        res.status(500).json({ message: 'Error deleting notary', error });
    }
});



app.put('/notaries/:id', async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    console.log('ID:', req.params.id);
    console.log('Update Data:', req.body);
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


// Add city
app.post("/cities", async (req, res) => {
  const { city_name, country_id } = req.body;

    try {
    const newCity = await Cities_Model.create({country_id, city_name });
   
    res.status(201).json({ message: "City added successfully!", cities: newCity});
  } catch (error) {
    res.status(500).json({ error: "Error adding city" });
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
  const { building_name,area, ar_description,en_description,thsLink, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id} = req.body;

    try {
    const newBuilding = await Buildings_Model.create({building_name,area, ar_description,en_description,thsLink, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id});
   
    res.status(201).json({ message: "Building added successfully!", buildings: newBuilding});
  } catch (error) {
    res.status(500).json({ error: "Error adding building" });
  }
});


// Add Address testt
app.post("/AddAddress", async (req, res) => {
  const {city_id, street, coordinates} = req.body;

    try {
    const newAddress = await Addresses_Model.create({city_id, street, coordinates});
   
    res.status(201).json({ message: "Address added successfully!", addresses: newAddress});
  } catch (error) {
    res.status(500).json({ error: "Error adding Address" });
  }
});


// Server setup
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
