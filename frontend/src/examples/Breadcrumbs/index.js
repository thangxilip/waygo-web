import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import { useTranslation } from "react-i18next";

function Breadcrumbs({ icon, title, route, light }) {
  const routes = route.slice(0, -1);
  const { t } = useTranslation();

  return (
    <ArgonBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) =>
              light ? white.main : grey[600],
            opacity: 0.8,
          },
        }}
        separator="›"
      >
        <Link to="/">
          <ArgonTypography
            component="span"
            variant="body1"
            color={light ? "white" : "black"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </ArgonTypography>
        </Link>

        {routes.map((el) => (
          <Link to={`/${el}`} key={el}>
            <ArgonTypography
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "black"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {t(el)}
            </ArgonTypography>
          </Link>
        ))}
        <ArgonTypography
          component="span"
          variant="button"
          textTransform="capitalize"
          color={light ? "white" : "black"}
          opacity={light ? 0.9 : 0.5}
          sx={{ lineHeight: 0 }}
        >
          {title ? t(title.replace("-", " ")) : t("statusReport")}
        </ArgonTypography>
      </MuiBreadcrumbs>
    </ArgonBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
