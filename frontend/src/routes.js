import StatusReports from "pages/statusReports";
import Statistics from "pages/statistics";
import Notifications from "pages/notifications";
import DashboardLayout from "layouts/dashboard";
import { Navigate, useRoutes } from "react-router-dom";
import SignIn from "layouts/authentication/sign-in";
import { Lots } from "pages/lots";

export const routes = (loggedIn = false) => [
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    element: loggedIn ? (
      <DashboardLayout />
    ) : (
      <Navigate to={"/sign-in"} replace />
    ),
    path: "/",
    children: [
      {
        path: "/",
        element: <StatusReports />,
      },
      {
        path: "/lots",
        element: <Lots />,
      },
      {
        path: "/:state/:view/:id",
        element: <Lots />,
      },
      {
        path: "/statistics",
        element: <Statistics />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
];

const index = () => {
  const loggedIn =
    localStorage.getItem("refresh_token") ||
    localStorage.getItem("access_token")
      ? true
      : false;
  const appRoutes = routes(loggedIn);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const content = useRoutes(appRoutes);
  return content;
};

export default index;
