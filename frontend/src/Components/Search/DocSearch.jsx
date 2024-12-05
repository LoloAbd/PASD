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
    mode: "light",
    background: { default: "#ffffff" }, // White background
    text: { primary: "#000000" }, // Black text
  },
  typography: {
    fontFamily: "Helvetica", // Helvetica font
    h1: { fontSize: "1.4rem", fontWeight: "bold" },
    h5: { fontSize: "1.2rem" },
    body1: { fontSize: "0.8rem" },
  },
});

function App() {
  const [buildings, setBuildings] = useState([]);
  const [selectedDecade, setSelectedDecade] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/buildings")
      .then((response) => setBuildings(response.data))
      .catch((error) => console.error("Error fetching buildings:", error));
  }, []);

  const handleDecadeChange = (e) => setSelectedDecade(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredBuildings = buildings.filter(
    (b) =>
      (selectedDecade === "all" || `${b.DOC}`.startsWith(selectedDecade.slice(0, 3))) &&
      (`${b.DOC}`.includes(searchTerm) ||
        (b.LocationID && b.LocationID.toLowerCase().includes(searchTerm)))
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="sticky"
        style={{
          backgroundColor: "#000000", // Black navbar
          padding: "5px 20px",
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
              PASD - DOC Search
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
                  padding: "7px 10px",
                },
              }}
            />
            <Select
              value={selectedDecade}
              onChange={handleDecadeChange}
              style={{
                color: "black",
                border: "1px solid black",
                backgroundColor: "white",
                padding: "0 10px",
              }}
            >
              <MenuItem value="all">All Decades</MenuItem>
              <MenuItem value="1970s">1970s</MenuItem>
              <MenuItem value="1980s">1980s</MenuItem>
              <MenuItem value="1990s">1990s</MenuItem>
              <MenuItem value="2000s">2000s</MenuItem>
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
                  backgroundColor: "#000000", // Black divs
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
                    {building.LocationID}
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

export default App;
