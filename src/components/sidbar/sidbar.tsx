import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme/theme";

// Importation des nouvelles icônes
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';

import image from "../image/logo.png"
interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Item: React.FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar: React.FC<{ isSidebar: boolean }> = ({ isSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={image}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
                  </Box>
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <InfoOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              {/* <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Ed Roh
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  VP Fancy Admin
                </Typography>
              </Box> */}
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<DashboardOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              java 
            </Typography>
            <Item
              title="Download le java"
              to="/DownloadPage"
              icon={<InstallDesktopIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Gérer l'équipe"
              to="/team"
              icon={<GroupOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Adherent"
              to="/Adherent"
              icon={<PersonAddOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="VisiteursManagement"
              to="/visiteur"
              icon={<PersonSearchOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                <Item
              title="UnbanManagement"
              to="/UnbanManagement"
              icon={<PersonSearchOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Cotisation"
              to="/Cotisation"
              icon={<AttachMoneyOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Information Inscription"
              to="/contacts"
              icon={<InfoOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Document"
              to="/document"
              icon={<DescriptionOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Transaction"
              to="/transaction"
              icon={<MonetizationOnOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Stats"
              to="/stats"
              icon={<ShowChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Creation Profile"
              to="/form"
              icon={<PersonAddAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendrier"
              to="/calendar"
              icon={<CalendarMonthOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Profile"
              to="/Account"
              icon={<AccountCircleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Demande"
              to="/evenement"
              icon={<EventAvailableOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
               <Item
              title="ProjectPage"
              to="/ProjectPage"
              icon={<AssignmentTurnedInIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="EvenementEdit"
              to="/evenementEdit"
              icon={<EditOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Crée un AG"
              to="/createAG"
              icon={<AddCircleOutlineIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Crée un vote"
              to="/createVote"
              icon={<HowToVoteOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Votez"
              to="/vote"
              icon={<BallotOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Connexion
            </Typography>
            <Item
              title="Logout"
              to="/logout"
              icon={<LogoutOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
