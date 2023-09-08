import { useEffect } from "react";

// react-router components
import { useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Argon Dashboard 2 MUI themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

// Argon Dashboard 2 MUI contexts
import { useArgonController } from "context";

// Images
import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getQuery } from "utils/httpServices";
import httpService from "utils/httpServices";
import { Endpoints } from "utils/httpServices";
import { removeAuthToken } from "utils/helper";
import createAuthRefreshInterceptor from "axios-auth-refresh";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQuery,
      refetchInterval: Infinity,
    },
  },
});

export default function App() {
  const [controller] = useArgonController();
  const { darkMode } = controller;
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    const refreshAuthLogic = () =>
      httpService
        .post(Endpoints.refresh, {
          refresh: localStorage.getItem("refresh_token"),
        })
        .then(({ data }) => {
          localStorage.setItem("access_token", data?.access);
          httpService.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data?.access}`;
          return Promise.resolve();
        })
        .catch((e) => {
          removeAuthToken();
          window.location.href = "/sign-in";
          return Promise.reject(e);
        });

    // Instantiate the interceptor
    createAuthRefreshInterceptor(httpService, refreshAuthLogic);
  }, []);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
