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
import waygoImg from "assets/images/waygo.png";
import waygoDarkImg from "assets/images/waygo_dark.png";
import { useTranslation } from "react-i18next";
import { useArgonController } from "context";

const initialValues = {
  userName: "",
  password: "",
};

function SignIn() {
  const [controller] = useArgonController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notValidUser, setNotValidUser] = useState("");
  const validations = yup.object().shape({
    userName: yup.string().required(t("pleaseEnterUserName")),
    password: yup.string().required(t("pleaseEnterPassword")),
  });
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
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/");
          })
          .catch((err) => setNotValidUser(err.response.data.detail));
      },
    });
  return (
    <CoverLayout
      image={darkMode ? waygoDarkImg : waygoImg}
      imgPosition="top"
      button={{ color: "dark", variant: "gradient" }}
    >
      <Card>
        {/* <ArgonBox sx={{ backgroundImage: `url(${waygoImg})` }}></ArgonBox> */}
        <ArgonBox p={3} mb={1} textAlign="center">
          <ArgonTypography variant="h5" fontWeight="light">
            {t("pleaseLogIn")}
          </ArgonTypography>
        </ArgonBox>

        <ArgonBox pb={3} px={3}>
          <ArgonBox component="form" role="form">
            <ArgonBox mb={2}>
              <ArgonInput
                sx={{ border: "1px solid" }}
                id="userName"
                type="text"
                placeholder={t("username")}
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
                placeholder={t("password")}
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
                {t("invalidUsernameOrPassword")}
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
                {t("logIn")}
              </ArgonButton>
            </ArgonBox>
          </ArgonBox>
        </ArgonBox>
      </Card>
    </CoverLayout>
  );
}

export default SignIn;
