import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  TextField,
} from "@mui/material";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

const theme = createTheme({
  palette: {
    mode: "light", // Light mode for white background
    background: { default: "#ffffff" }, // White background
    text: { primary: "#000000" }, // Black text
  },
  typography: {
    fontFamily: "Helvetica", // Helvetica font
    h1: { fontSize: "2rem", fontWeight: "bold" },
    h5: { fontSize: "1.2rem" },
    body1: { fontSize: "1rem" },
  },
});

function ArchitectSearch() {
  const [buildings, setBuildings] = useState([]);
  const [uniqueArchitects, setUniqueArchitects] = useState([]); // Store unique ArchitectIDs
  const [selectedArchitect, setSelectedArchitect] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Buildings from Backend
  useEffect(() => {
    axios
      .get("http://localhost:3001/buildings")
      .then((response) => {
        setBuildings(response.data);

        // Extract unique ArchitectIDs for the dropdown
        const architects = [...new Set(response.data.map((b) => b.ArchitectID))];
        setUniqueArchitects(architects);
      })
      .catch((error) => console.error("Error fetching buildings:", error));
  }, []);

  const handleArchitectChange = (e) => setSelectedArchitect(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Filter buildings based on ArchitectID and search term
  const filteredBuildings = buildings.filter(
    (b) =>
      (selectedArchitect === "all" || b.ArchitectID === selectedArchitect) &&
      (b.Name.toLowerCase().includes(searchTerm) ||
        b.Name.toLowerCase().includes(searchTerm))
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="sticky"
        style={{
          backgroundColor: "#000000", // Black navbar
          padding: "10px 20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <HistoryEduIcon
              style={{
                marginRight: "10px",
                fontSize: "2.5rem",
                color: "white",
              }}
            />
            <Typography variant="h1" style={{ color: "white" }}>
              PASD - Architect Search
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                style: {
                  color: "black",
                  backgroundColor: "white",
                  border: "1px solid black",
                  padding: "9px 10px",
                },
              }}
            />
            <Select
              value={selectedArchitect}
              onChange={handleArchitectChange}
              style={{
                color: "black",
                border: "1px solid black",
                backgroundColor: "white",
                padding: "0.1px 10px",
              }}
            >
              <MenuItem value="all">All Architects</MenuItem>
              {uniqueArchitects.map((architect) => (
                <MenuItem key={architect} value={architect}>
                  Architect {architect}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "30px", backgroundColor: "#ffffff" }}> {/* White background */}
        <Grid container spacing={4}>
          {filteredBuildings.map((building, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                style={{
                  backgroundColor: "#000000", // Black cards
                  color: "white",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="https://i0.wp.com/cdn.shopify.com/s/files/1/0747/9332/0738/files/Mar_Saba_Monastery_1024x1024.jpg?ssl=1" // Use an appropriate image
                  alt={building.Name}
                  style={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h5">{building.Name}</Typography>
                  <Typography variant="body1">
                    {building.BuildingDetail}
                  </Typography>
                  <Typography variant="body2">
                    Architect ID: {building.ArchitectID}
                  </Typography>
                  <Typography variant="body2">Year: {building.DOC}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default ArchitectSearch;
