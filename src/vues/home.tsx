// import React from "react";
// import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
// import { tokens } from "../components/theme/theme";
// // import { mockTransactions } from "../../data/mockData";
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import EmailIcon from "@mui/icons-material/Email";
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import TrafficIcon from "@mui/icons-material/Traffic";
// import Header from "../components/Header";
// // import Header from "../../components/Header";
// // import StatBox from "../../components/StatBox";
// // import LineChart from "../../components/LineChart";
// // import GeographyChart from "../../components/GeographyChart";
// // import BarChart from "../../components/BarChart";
// // import ProgressCircle from "../../components/ProgressCircle";



// function Dashboard()  {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   return (
//     <Box m="20px">
//       {/* HEADER */}
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//          <Header title="DASHBOARD" subtitle="Bienvenue a votre  dashboard" /> 

//          <Box>
        
//         </Box>
//       </Box>

    
//     </Box>
//   );
// };

// export default Dashboard;
import React from "react";
import { Box, IconButton, Typography, useTheme, Button, Grid } from "@mui/material";
import { tokens } from "../components/theme/theme";
import Header from "../components/Header";
import  SubscriptionIcon  from '@mui/icons-material/Subscriptions';
import  StudioIcon  from '@mui/icons-material/Subscriptions';
import  CrmIcon  from '@mui/icons-material/Subscriptions';
import  SignatureIcon  from '@mui/icons-material/Subscriptions';
import  KnowledgeIcon  from '@mui/icons-material/Subscriptions';

import  AccountingIcon  from '@mui/icons-material/Subscriptions';

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const items = [
    { icon: <SubscriptionIcon />, label: "abonnement" },
    { icon: <StudioIcon />, label: "assosiation" },
    { icon: <CrmIcon />, label: "client" },
    { icon: <SignatureIcon />, label: "document" },
    { icon: <KnowledgeIcon />, label: "information" },
    { icon: <AccountingIcon />, label: "comptabiliter" },
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Bienvenue a votre dashboard" />
      </Box>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={2}
              border="1px solid #e0e0e0"
              borderRadius="8px"
            >
              <IconButton>
                {item.icon}
              </IconButton>
              <Typography variant="h6" textAlign="center">
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;
