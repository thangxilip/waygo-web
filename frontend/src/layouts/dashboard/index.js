import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Outlet } from "react-router-dom";
import Sidenav from "examples/Sidenav";
import { useArgonController, setMiniSidenav } from "context";
import { useState } from "react";
import waygoImg from "assets/images/waygo.png";
import waygoDarkImg from "assets/images/waygo_dark.png";
import waygoMiniImg from "assets/images/waygo_mini.png";
import waygoDarkMiniImg from "assets/images/waygo_dark_mini.png";
import ArgonBox from "components/ArgonBox";
import { useMediaQuery } from "@mui/material";

function Default() {
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const isMobile = useMediaQuery("(max-width:475px)");

  const [controller, dispatch] = useArgonController();
  const { miniSidenav, sidenavColor, darkMode } = controller;

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const brand = miniSidenav
    ? darkMode
      ? waygoDarkMiniImg
      : waygoMiniImg
    : darkMode
    ? waygoDarkImg
    : waygoImg;

  return (
    <>
      <DashboardLayout>
        <Sidenav
          color={sidenavColor}
          brand={brand}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
        <DashboardNavbar />
        <ArgonBox mt={isMobile ? 0 : 4}>
          <Outlet />
        </ArgonBox>
      </DashboardLayout>
    </>
  );
}

export default Default;
