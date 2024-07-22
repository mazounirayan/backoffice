
import React from "react";
import { Box, IconButton, Typography, useTheme, Button, Grid } from "@mui/material";
import { tokens } from "../components/theme/theme";
import Header from "../components/Header";


import GroupsIcon from '@mui/icons-material/Groups';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import GroupIcon from '@mui/icons-material/Group';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import  AccountingIcon  from '@mui/icons-material/Subscriptions';
import { Link } from "react-router-dom";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // <Route path="/vote1" element={<PrivateRoute element={<Vote />} />} />
  const items = [
    { icon: <GroupIcon />, label: "team", route: "/team" },
    { icon: <HowToVoteIcon />, label: "vote", route: "/vote1" },
    { icon: <InsertDriveFileIcon />, label: "document", route: "/document" },
    { icon: <GroupsIcon />, label: "ag", route: "/ag" },
    { icon: <SpeakerNotesIcon />, label: "Demandes", route: "/demande" },
    { icon: <AlignVerticalBottomIcon />, label: "VoteResults", route: "/VoteResults" },
    
  ];
  return (
    <Box m="20px">
     
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Bienvenue a votre dashboard" />
      </Box>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
  
            <Link to={item.route} >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={2}
                border="1px solid #e0e0e0"
                borderRadius="8px"
                color={colors.greenAccent[400]}
              >
                <IconButton>
                  {item.icon}
                </IconButton>
                <Typography variant="h6" textAlign="center">
                  {item.label}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;