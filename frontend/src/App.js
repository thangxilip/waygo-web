import React, { useEffect } from "react";

// react-router components
import { useLocation } from "react-router-dom";

// @mui material components
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as coreLocales from "@mui/material/locale";
import * as dataGridLocales from "@mui/x-data-grid/locales";
import i18n from "configs/i18n";
import { langToLocale } from "utils/helper";

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
  const [locale, setLocale] = React.useState(langToLocale(i18n.language));

  const themeWithLocale = React.useMemo(
    () =>
      createTheme(darkMode ? themeDark : theme, {
        ...coreLocales[locale],
        ...dataGridLocales[locale],
      }),
    [locale, darkMode]
  );

  const handleLanguageChange = (newLanguage) => {
    setLocale(langToLocale(newLanguage));
  };

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

    const refreshOptions = {
      shouldRefresh: (error) => {
        return error?.config?.url !== Endpoints.auth;
      },
    };

    // Instantiate the interceptor
    createAuthRefreshInterceptor(httpService, refreshAuthLogic, refreshOptions);

    // Subscribe to the languageChanged event
    i18n.on("languageChanged", handleLanguageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <ThemeProvider theme={themeWithLocale}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
