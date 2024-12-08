const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AdminModel = require('./models/Admin');
const BuildingModel = require('./models/Building');
const NotariesModel = require('./models/Notaries');
const OwnersModel = require('./models/Owners');
const CountriesModel = require('./models/Countries ')
const CitiesModel = require('./models/Cities')


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
        const { email, username, password, firstName, lastName } = req.body;

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
        const newAdmin = await AdminModel.create({ firstName, lastName, email, username, password });

        // Return the success response
        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });

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
        const buildings = await BuildingModel.find(); // Fetch all Building
        res.status(200).json(buildings); // Respond with admins in JSON format
  } catch (error) {
      console.error("Error fetching buildings:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// API Endpoint to Fetch Notaries
app.get('/notaries', async (req, res) => {
  try {
        const notaries = await NotariesModel.find(); 
        res.status(200).json(notaries);
  } catch (error) {
      console.error("Error fetching notaries:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// API Endpoint to Fetch Owners
app.get('/owners', async (req, res) => {
  try {
        const owners = await OwnersModel.find();
        res.status(200).json(owners);
  } catch (error) {
      console.error("Error fetching owners:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/countries", async (req, res) => {
  try {
    const countries = await CountriesModel.find(); // Fetch only required fields
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching countries" });
  }
});


app.post("/cities", async (req, res) => {
  const { city_name, country_id } = req.body;

    try {
    const newCity = await CitiesModel.create({country_id, city_name });
   
    res.status(201).json({ message: "City added successfully!", cities: newCity});
  } catch (error) {
    res.status(500).json({ error: "Error adding city" });
  }
});


// Server setup
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
