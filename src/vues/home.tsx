import React from "react";
import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../components/theme/theme";
// import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../components/Header";
// import Header from "../../components/Header";
// import StatBox from "../../components/StatBox";
// import LineChart from "../../components/LineChart";
// import GeographyChart from "../../components/GeographyChart";
// import BarChart from "../../components/BarChart";
// import ProgressCircle from "../../components/ProgressCircle";



function Dashboard()  {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
         <Header title="DASHBOARD" subtitle="Bienvenue a votre  dashboard" /> 

         <Box>
        
        </Box>
      </Box>

    
    </Box>
  );
};

export default Dashboard;
