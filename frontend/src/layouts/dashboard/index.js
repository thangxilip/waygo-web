import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Outlet } from "react-router-dom";
import Sidenav from "examples/Sidenav";
import { useArgonController, setMiniSidenav } from "context";
import { useState } from "react";
import waygoPng from "assets/images/waygo.png";
import ArgonBox from "components/ArgonBox";
import { useMediaQuery } from "@mui/material";

function Default() {
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const isMobile = useMediaQuery("(max-width:475px)");

  const [controller, dispatch] = useArgonController();
  const { miniSidenav, sidenavColor } = controller;

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

  return (
    <>
      <DashboardLayout>
        <Sidenav
          color={sidenavColor}
          brand={waygoPng}
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
