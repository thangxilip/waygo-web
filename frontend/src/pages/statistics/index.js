import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import ArgonBox from "components/ArgonBox";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Endpoints } from "utils/httpServices";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Grid, Paper, Typography } from "@mui/material";
import { useArgonController } from "context";
import print from "assets/images/print.svg";
import { secondsToDuration } from "utils/helper";
import { useTranslation } from "react-i18next";

const Statistics = () => {
  const [controller] = useArgonController();
  const { darkMode } = controller;

  const [start, setStart] = React.useState(dayjs().subtract(1, "month"));
  const [end, setEnd] = React.useState(dayjs());
  const { t } = useTranslation();

  const [options, setOptions] = useState({
    theme: {
      mode: "light",
      palette: "#fff",
    },
    chart: {
      width: "100%",
      height: 400,
      toolbar: {
        tools: {
          download: `<img src=${print} alt="print" width="16px"/>`,
        },
      },
    },
    stroke: {
      curve: "smooth",
      show: "false",
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    xaxis: {
      type: "category",
    },
    plotOptions: {
      bar: {
        columnWidth: 40,
      },
    },
    colors: ["#2E93fA", "#66DA26", "#546E7A", "#7be3af", "#c5206ab5"],
  });

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      theme: { ...prev.theme, mode: darkMode ? "dark" : "light" },
    }));
  }, [darkMode]);

  const { data } = useQuery(
    [
      `${Endpoints.statistics}`,
      {
        start: dayjs(start).format("YYYY-MM-DD HH:mm:ss"),
        end: dayjs(end).format("YYYY-MM-DD HH:mm:ss"),
      },
    ],
    {
      enabled: Boolean(start && end),
    }
  );

  return (
    <Paper sx={{ p: 3, height: "100%", width: "100%" }}>
      <ArgonBox sx={{ gap: "10px", display: "flex", flexWrap: "wrap" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ArgonBox display="flex" flexDirection="column">
            <Typography mb={1} variant="caption">
              {t("startDate")}
            </Typography>
            <DatePicker
              value={start}
              onChange={(newValue) => setStart(newValue)}
              disableFuture
            />
          </ArgonBox>
          <ArgonBox display="flex" flexDirection="column">
            <Typography mb={1} variant="caption">
              {t("endDate")}
            </Typography>
            <DatePicker
              value={end}
              onChange={(newValue) => setEnd(newValue)}
              disableFuture
            />
          </ArgonBox>
        </LocalizationProvider>
      </ArgonBox>
      {data ? (
        <Grid container spacing={4} sx={{ marginTop: 0 }}>
          <Grid item xs={12}>
            <Chart
              height="300px"
              options={{
                ...options,
                title: {
                  text: t("statisticsChart1"),
                  style: {
                    fontSize: 16,
                    fontFamily: "inherit",
                    fontWeight: 500,
                  },
                },
              }}
              series={[
                {
                  name: t("quantity"),
                  data: data?.total_wood_dried,
                  type: "bar",
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <Chart
              height="300px"
              options={{
                ...options,
                title: {
                  text: t("statisticsChart2"),
                  style: {
                    fontSize: 16,
                    fontFamily: "inherit",
                    fontWeight: 500,
                  },
                },
              }}
              series={[
                {
                  name: t("quantity"),
                  data: data?.total_chamber_quantity_dried,
                  type: "bar",
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <Chart
              height="400px"
              options={{
                ...options,
                title: {
                  text: t("statisticsChart3"),
                  style: {
                    fontSize: 16,
                    fontFamily: "inherit",
                    fontWeight: 500,
                  },
                },
                colors: ["#66DA26", "#2E93fA"],
                chart: {
                  ...options.chart,
                  stacked: true,
                  stackType: "normal",
                  type: "bar",
                },
                xaxis: {
                  ...options.xaxis,
                  categories: Object.keys(data?.operation_time),
                },
                yaxis: {
                  labels: {
                    formatter: (value) => {
                      return secondsToDuration(value, "");
                    },
                  },
                },
                plotOptions: {
                  ...options.plotOptions,
                  bar: {
                    ...options.plotOptions.bar,
                    columnWidth: 40,
                    dataLabels: {
                      position: "top",
                      total: {
                        enabled: true,
                        formatter: (
                          value,
                          { seriesIndex, dataPointIndex, w }
                        ) => {
                          let operationTime =
                            w?.config?.series[0]?.data[dataPointIndex];
                          let idleTime =
                            w?.config?.series[1]?.data[dataPointIndex];
                          if (idleTime && operationTime) {
                            operationTime = parseFloat(operationTime);
                            idleTime = parseFloat(idleTime);
                            const total = operationTime + idleTime;
                            return `${
                              Math.round((operationTime / total) * 10000) / 100
                            } %`;
                          }
                          return "0 %";
                        },
                      },
                    },
                  },
                },
              }}
              series={[
                {
                  name: t("operationTime"),
                  data: Object.values(data?.operation_time),
                  type: "bar",
                },
                {
                  name: t("idleTime"),
                  data: Object.values(data?.idle_time),
                  type: "bar",
                },
              ]}
            />
          </Grid>
        </Grid>
      ) : null}
    </Paper>
  );
};

export default Statistics;
