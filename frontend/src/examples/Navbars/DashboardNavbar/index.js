import React from "react";
import { useState, useEffect } from "react";

// react-router components
import { useLocation, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import Breadcrumbs from "examples/Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarDesktopMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Argon Dashboard 2 MUI context
import {
  useArgonController,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";

// Images
import { MenuItem, Typography, useMediaQuery } from "@mui/material";
import { setDarkSidenav } from "context";
import { setDarkMode } from "context";
import { getUser } from "utils/helper";
import { removeAuthToken } from "utils/helper";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTranslation } from "react-i18next";
import enLang from "assets/images/en-lang.svg";
import viLang from "assets/images/vi-lang.svg";
import { saveDarkModeToStorage } from "utils/helper";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState("static");
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const openProfile = Boolean(profileAnchorEl);
  const [controller, dispatch] = useArgonController();
  const user = getUser();
  const isMobile = useMediaQuery("(max-width:475px)");

  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const handleDarkMode = () => {
    setDarkSidenav(dispatch, !darkMode);
    setDarkMode(dispatch, !darkMode);
    saveDarkModeToStorage(!darkMode);
  };
  const handleGlobal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfile = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseProfile = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate("/sign-in");
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      {isMobile ? (
        <Breadcrumbs
          icon="home"
          title={route[route.length - 1]}
          route={route}
          light={transparentNavbar}
        />
      ) : null}
      <ArgonBox
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ArgonBox
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          {!isMobile ? (
            <Breadcrumbs
              icon="home"
              title={route[route.length - 1]}
              route={route}
              light={transparentNavbar ? light : false}
            />
          ) : null}
          <ArgonTypography color="white">
            <Icon
              fontSize="medium"
              sx={
                (navbarDesktopMenu,
                {
                  marginRight: "1rem",
                  opacity: `${light ? 0.8 : 0.5}`,
                  cursor: "pointer",
                })
              }
              onClick={handleMiniSidenav}
            >
              {!miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </ArgonTypography>
        </ArgonBox>
        <Toolbar sx={(theme) => navbarContainer(theme, { navbarType })}>
          {isMini ? null : (
            <ArgonBox sx={(theme) => navbarRow(theme, { isMini })}>
              <ArgonTypography
                variant="button"
                fontWeight="medium"
                color={transparentNavbar ? "white" : "black"}
              >
                <IconButton
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleGlobal}
                >
                  <img
                    src={i18n.language === "en" ? enLang : viLang}
                    alt="print"
                    width="25px"
                  />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={() => i18n.changeLanguage("en")}
                    sx={{ minWidth: 0 }}
                  >
                    <img src={enLang} alt="print" width="18px" />
                    <Typography sx={{ ml: 1, fontSize: 14 }} variant="body2">
                      English
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => i18n.changeLanguage("vi")}
                    sx={{ minWidth: 0 }}
                  >
                    <img src={viLang} alt="print" width="18px" />
                    <Typography sx={{ ml: 1, fontSize: 14 }} variant="body2">
                      Tiếng Việt
                    </Typography>
                  </MenuItem>
                </Menu>
              </ArgonTypography>
              <ArgonTypography
                variant="button"
                fontWeight="medium"
                color={transparentNavbar ? "white" : "black"}
              >
                <IconButton
                  focusRipple
                  onClick={handleDarkMode}
                  color={transparentNavbar ? "white" : "black"}
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </ArgonTypography>

              <ArgonTypography
                variant="button"
                fontWeight="medium"
                color={transparentNavbar ? "white" : "black"}
              >
                <IconButton
                  id="account-button"
                  aria-controls={openProfile ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openProfile ? "true" : undefined}
                  onClick={handleProfile}
                >
                  <Avatar sx={{ width: 28, height: 28 }} />
                </IconButton>
                <Menu
                  anchorEl={profileAnchorEl}
                  id="account-menu"
                  open={openProfile}
                  onClose={handleCloseProfile}
                  onClick={handleCloseProfile}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      pl: 2,
                      pr: 2,
                      alignItems: "center",
                    }}
                  >
                    <Avatar />
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2">{user?.username}</Typography>
                      <Typography variant="body2" sx={{ fontSize: 12 }}>
                        {user?.company?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    {t("logout")}
                  </MenuItem>
                </Menu>
              </ArgonTypography>
            </ArgonBox>
          )}
        </Toolbar>
      </ArgonBox>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: true,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
