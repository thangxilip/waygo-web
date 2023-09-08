import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import SidenavItem from "examples/Sidenav/SidenavItem";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

//mui icon
import SummarizeIcon from "@mui/icons-material/Summarize";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import HistoryIcon from "@mui/icons-material/History";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ComputerIcon from "@mui/icons-material/Computer";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";

// Argon Dashboard 2 MUI context
import { useArgonController, setMiniSidenav } from "context";

const routes = [
  {
    title: "Status Reports",
    icon: <SummarizeIcon />,
    path: "/",
  },
  {
    title: "Ongoing Lots",
    icon: <PrecisionManufacturingIcon />,
    path: "/ongoing-lots",
  },
  {
    title: "Historical Lots",
    icon: <HistoryIcon />,
    path: "/historical-lots",
  },
  {
    title: "Statistics",
    icon: <AssessmentIcon />,
    path: "/statistics",
  },
  {
    title: "Technology",
    icon: <ComputerIcon />,
    path: "/technology",
  },
  {
    title: "Help",
    icon: <HelpCenterIcon />,
    path: "/help",
  },
];
function Sidenav({ color, brand, brandName, ...rest }) {
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, darkSidenav, layout } = controller;
  const location = useLocation();
  const { pathname } = location;

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map((item) => {
    return (
      <Link to={item.path} key={item.path} rel="noreferrer">
        <SidenavItem
          name={item.title}
          active={
            (pathname.includes(item.path) && item.path !== "/") ||
            item.path === pathname
          }
          icon={item.icon}
        />
      </Link>
    );
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ darkSidenav, miniSidenav, layout }}
    >
      <ArgonBox pt={3} pb={1} px={5} textAlign="center">
        <ArgonBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <ArgonTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && (
            <ArgonBox
              component="img"
              src={brand}
              alt="Argon Logo"
              width="10rem"
              mr={0.25}
            />
          )}
          <ArgonBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <ArgonTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              color={darkSidenav ? "white" : "dark"}
            >
              {brandName}
            </ArgonTypography>
          </ArgonBox>
        </ArgonBox>
      </ArgonBox>
      <Divider light={darkSidenav} />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
