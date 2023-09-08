import { useState } from "react";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

// Authentication layout components
import CoverLayout from "../components/CoverLayout";
import { Card } from "@mui/material";
import httpService from "utils/httpServices";
import { Endpoints } from "utils/httpServices";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import waygoPng from "assets/images/waygo.png";


const initialValues = {
  userName: "",
  password: "",
};

const validations = yup.object().shape({
  userName: yup.string().required("Please enter user name"),
  password: yup.string().required("Please enter password"),
});

function SignIn() {
  const navigate = useNavigate();
  const [notValidUser, setNotValidUser] = useState("");
  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues: initialValues,
      validationSchema: validations,

      onSubmit: (values) => {
        httpService
          .post(Endpoints.auth, {
            username: values.userName,
            password: values.password,
          })
          .then((res) => {
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("user", JSON.stringify(res.data.app_user));
            navigate("/");
          })
          .catch((err) => setNotValidUser(err.response.data.detail));
      },
    });
  return (
    <CoverLayout
      //title="Welcome!"
      //description="Use these awesome forms to login or create new account in your project for free."
      image={waygoPng}
      imgPosition="top"
      button={{ color: "dark", variant: "gradient" }}
    >
      <Card>
        <ArgonBox sx={{ backgroundImage: `url(${waygoPng})` }}></ArgonBox>      
        <ArgonBox p={3} mb={1} textAlign="center">
          <ArgonTypography variant="h5" fontWeight="light">
            Please log in
          </ArgonTypography>
        </ArgonBox>


        <ArgonBox pb={3} px={3}>
          <ArgonBox component="form" role="form">
            <ArgonBox mb={2}>
              <ArgonInput
                sx={{ border: "1px solid" }}
                id="userName"
                type="text"
                placeholder="User Name"
                value={values.userName}
                onChange={(e) => {
                  handleChange(e);
                  setNotValidUser("");
                }}
                onBlur={handleBlur}
              />
              {errors.userName && touched.userName ? (
                <ArgonTypography
                  style={{
                    fontSize: "0.8rem",
                    color: "red",
                    marginLeft: "0.5rem",
                  }}
                >
                  {errors.userName}
                </ArgonTypography>
              ) : null}
            </ArgonBox>
            <ArgonBox mb={2}>
              <ArgonInput
                id="password"
                type="password"
                placeholder="Password"
                value={values.password}
                onChange={(e) => {
                  handleChange(e);
                  setNotValidUser("");
                }}
                onBlur={handleBlur}
              />
              {errors.password && touched.password ? (
                <ArgonTypography
                  style={{
                    fontSize: "0.8rem",
                    color: "red",
                    marginLeft: "0.5rem",
                  }}
                >
                  {errors.password}
                </ArgonTypography>
              ) : null}
            </ArgonBox>
            {notValidUser && (
              <ArgonTypography
                style={{
                  fontSize: "0.8rem",
                  color: "red",
                  marginLeft: "0.5rem",
                }}
              >
                {notValidUser}
              </ArgonTypography>
            )}
            <ArgonBox mt={4} mb={1}>
              <ArgonButton
                variant="contained"
                color="light"
                type="submit"
                fullWidth
                onClick={handleSubmit}
              >
                Log In
              </ArgonButton>
            </ArgonBox>
          </ArgonBox>
        </ArgonBox>
      </Card>
    </CoverLayout>
  );
}

export default SignIn;
