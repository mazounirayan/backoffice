import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../components/theme/theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../components/Header";
import { User } from "../services/api";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pa-api-0tcm.onrender.com/users');
        const data = response.data.Users.map((user: User) => ({
          id: user.id,
          name: `${user.prenom} ${user.nom}`,
          email: user.email,
          age: user.age || "N/A",
          phone: user.numTel || "N/A",
          access: user.role
        }));
        setRows(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };
  
  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleAddMember = () => {
    navigate("/form"); // Navigate to the form route
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "access",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <>
            <Box
              width="60%"
              p="5px"
              display="flex"
              alignItems="center"
              mt="9px"
              justifyContent="center"
              bgcolor={
                access === "Administrateur"
                  ? colors.greenAccent[600]
                  : access === "Adherent"
                  ? colors.greenAccent[700]
                  : colors.greenAccent[700]
              }
              borderRadius="4px"
              onClick={handleClick} // Add onClick to open the menu
            >
              {access === "Administrateur" && <AdminPanelSettingsOutlinedIcon />}
              {access === "Visiteur" && <SecurityOutlinedIcon />}
              {access === "Adherent" && <LockOpenOutlinedIcon />}
              <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                {access}
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Administrateur</MenuItem>
              <MenuItem onClick={handleClose}>Adherent</MenuItem>
              <MenuItem onClick={handleClose}>Visiteur</MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Typography variant="h6">Team Members</Typography>
        <Button variant="contained" color="primary" onClick={handleAddMember}>
          Add Member
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} slots={{ toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Team;
