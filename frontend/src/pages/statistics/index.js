import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import ArgonBox from "components/ArgonBox";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Endpoints } from "utils/httpServices";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Grid } from "@mui/material";
import { useArgonController } from "context";
import ArgonTypography from "components/ArgonTypography";
import print from "assets/images/print.svg";

const Statistics = () => {
  const [controller] = useArgonController();
  const { darkMode } = controller;

  const [start, setStart] = React.useState();
  const [end, setEnd] = React.useState();

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
      bar: {},
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
    <ArgonBox sx={{ height: "100%", width: "100%" }}>
      <ArgonBox sx={{ gap: "10px", display: "flex", flexWrap: "wrap" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ArgonBox display="flex" flexDirection="column">
            <ArgonTypography>Start Date</ArgonTypography>
            <DatePicker
              value={start}
              onChange={(newValue) => setStart(newValue)}
              disableFuture
            />
          </ArgonBox>
          <ArgonBox display="flex" flexDirection="column">
            <ArgonTypography>End Date</ArgonTypography>
            <DatePicker
              value={end}
              onChange={(newValue) => setEnd(newValue)}
              disableFuture
            />
          </ArgonBox>
        </LocalizationProvider>
      </ArgonBox>
      {data ? (
        <Grid container spacing={4} sx={{ marginTop: "2rem" }}>
          <Grid item xs={12}>
            <ArgonTypography>
              Wood of selected species dry out in the time frame (in cubic
              meters)
            </ArgonTypography>
            <Chart
              height="300px"
              options={options}
              series={[
                {
                  name: "Species",
                  data: data?.total_wood_dried,
                  type: "bar",
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <ArgonTypography>
              Total quantity have the selected chambers dried in the time frame
              (in cubic meters, regardless of species)
            </ArgonTypography>
            <Chart
              height="300px"
              options={options}
              series={[
                {
                  name: "Chambers",
                  data: data?.total_chamber_quantity_dried,
                  type: "bar",
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <ArgonTypography>
              Chambers be in operation, operation vs idle time
            </ArgonTypography>
            <Chart
              height="400px"
              options={{
                ...options,
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
                plotOptions: {
                  ...options.plotOptions,
                  bar: {
                    ...options.plotOptions.bar,
                    columnWidth: 40,
                    dataLabels: {
                      position: "top",
                      total: {
                        enabled: true,
                        formatter: (p, { seriesIndex, dataPointIndex, w }) => {
                          let idle = w?.config?.series[1]?.data[dataPointIndex];
                          if (idle && p) {
                            let op = parseFloat(p);
                            idle = parseFloat(idle);
                            const total = op + idle;
                            return `${
                              Math.round(((total - idle) / total) * 10000) / 100
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
                  name: "Operation Time",
                  data: Object.values(data?.operation_time),
                  type: "bar",
                },
                {
                  name: "Idle Time",
                  data: Object.values(data?.idle_time),
                  type: "bar",
                },
              ]}
            />
          </Grid>
        </Grid>
      ) : null}
    </ArgonBox>
  );
};

export default Statistics;
