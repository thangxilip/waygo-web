// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import PageLayout from "examples/LayoutContainers/PageLayout";

function CoverLayout({
  title,
  description,
  image,
  imgPosition,
  button,
  children,
}) {
  return (
    <PageLayout>
      <ArgonBox mt={1}></ArgonBox>
      <ArgonBox
        width="calc(100% - 2rem)"
        minHeight="50vh"
        borderRadius="lg"
        mx={2}
        mt={2}
        mb={8}
        pt={18}
        pb={20}
        sx={{
          backgroundImage: ({
            functions: { linearGradient, rgba },
            palette: { gradients },
          }) => image && `url(${image})`,
          backgroundSize: "clamp(280px, 300px, 380px) auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginBottom: 12,
          // mixBlendMode: "darken",
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ textAlign: "center" }}
        >
          <Grid item xs={10} lg={4}>
            <ArgonBox mb={1}>
              <ArgonTypography variant="h1" color="white" fontWeight="bold">
                {title}
              </ArgonTypography>
            </ArgonBox>
            <ArgonBox mb={2}>
              <ArgonTypography
                variant="body2"
                color="white"
                fontWeight="regular"
              >
                {description}
              </ArgonTypography>
            </ArgonBox>
          </Grid>
        </Grid>
      </ArgonBox>
      <ArgonBox
        mt={{ xs: -26, lg: -24 }}
        px={1}
        width="calc(100% - 2rem)"
        mx="auto"
      >
        <Grid container justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </ArgonBox>
    </PageLayout>
  );
}

// Setting default values for the props of CoverLayout
CoverLayout.defaultProps = {
  title: "",
  description: "",
  imgPosition: "center",
  button: { color: "white" },
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  imgPosition: PropTypes.string,
  button: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
