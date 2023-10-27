import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "utils/httpServices";

import ArgonBox from "components/ArgonBox";
import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArgonButton from "components/ArgonButton";
import { useNavigate } from "react-router-dom";
import { useArgonController } from "context";
import print from "assets/images/print.svg";
import dayjs from "dayjs";
import {
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const keys = {
  "amc": "AMC",
  "rh": "RH",
  "mc1": "MC1",
  "mc2": "MC2",
  "mc3": "MC3",
  "mc4": "MC4",
  "mc5": "MC5",
  "mc6": "MC6",
  "mc7": "MC7",
  "mc8": "MC8",
  "dbt1": "DBT1",
  "dbt2": "DBT2",
  "wbt1": "WBT1",
  "wbt2": "WBT2",
  "wood_temp1": 'WT1',
  "wood_temp2": 'WT2',
};

const colors = [
  "#2E93fA",
  "#66DA26",
  "#546E7A",
  "#7be3af",
  "#c5206ab5",
  "#FF5733",
  "#E74C3C",
  "#FFC300",
  "#3498DB",
  "#1ABC9C",
  "#9B59B6",
  "#F1C40F",
  "#16A085",
  "#D35400",
  "#FFAB22",
  "#6C3483",
];

export const LotsDataPlot = ({ lotID }) => {
  const navigate = useNavigate();
  const [controller] = useArgonController();
  const { darkMode } = controller;
  const { t } = useTranslation();

  const chartRef = useRef();

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    theme: {
      mode: "light",
      palette: "#fff",
    },
    chart: {
      id: "plot",
      type: "line",
      width: "100%",
      height: 400,
      toolbar: {
        tools: {
          download: `<img src=${print} alt="print" width="16px"/>`,
        },
      },
      events: {
      },
    },
    stroke: {
      show: true,
      curve: "straight",
      lineCap: "butt",
      colors: undefined,
      width: 1.5,
      dashArray: 0,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const date =
          w.globals.initialSeries[seriesIndex].data[dataPointIndex].x;
        const seriesData = w.globals.initialSeries
          .map((series, index) => {
            return `
              <div style='color: ${colors[index]}; width:40px;'>
                <div >${series.name}</div>
                <div>${series.data[dataPointIndex].y}</div>
              </div>
            `;
          })
          .filter(
            (series, index) =>
              w.globals.series[index] && w.globals.series[index].length > 0
          )
          .join(" ");
        return `
          <div class='apexcharts-tooltip-row'>
            <div>
              ${dayjs(date).format("DD/MM/YYYY HH:mm")}
            </div>
            <div class='apexcharts-tooltip-row'>
              ${seriesData}
            </div>
          </div>
        `;
      },
    },
    xaxis: {
      type: "datetime",
      tickAmount: 24, // Display 24 ticks for 24 hours (one tick per hour)
      labels: {
        formatter: function (value, timestamp, opts) {
          return dayjs(timestamp).format("DD/MM");
        },
      },
    },
    colors: colors,
    markers: {},
    legend: {
      show: false,
    },
  });

  const { data: lotData } = useQuery([`${Endpoints.lots}${lotID}/`]);
  const { data } = useQuery([
    `${Endpoints.lots}${lotID}/lot-data/`,
    { get_all: true },
  ]);

  const toggleSeries = (seriesName) => {
    const chart = ApexCharts.getChartByID("plot");
    chart.toggleSeries(seriesName);
  };

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      theme: { ...prev.theme, mode: darkMode ? "dark" : "light" },
    }));
  }, [darkMode]);

  useEffect(() => {
    if (data) {
      const temp = data?.reduce((acc, curr) => {
        Object.keys(keys).forEach((key) => {
          const time = dayjs(curr.time);
          const startOfHour = time
            .startOf("hour")
            .format("YYYY-MM-DD HH:mm:ss");
          const obj = {
            x: startOfHour, // or you can use endOfHour if you prefer
            y: curr[key],
          };

          const label = keys[key];

          if (obj.y && obj.y > -1) {
            if (acc?.[label]) {
              acc[label].push(obj);
            } else {
              acc[label] = [obj];
            }
          }
        });
        return acc;
      }, {});

      setSeries(Object.entries(temp).map(([k, v]) => ({ name: k, data: v })));
    }
  }, [data]);

  return (
    <ArgonBox className="data-plot">
      <ArgonButton
        onClick={() => {
          navigate(-1);
        }}
        sx={{ marginBottom: 2 }}
      >
        <ArrowBackIosIcon sx={{ fill: "#000" }} />
        Back
      </ArgonButton>
      <Box sx={{ mb: 0 }}>
        <Paper elevation={3} sx={{ pt: 2, pb: 2 }}>
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 5, ml: 2, mb: 5 }}>
              <Box>
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                  {t("chamber")}
                </Typography>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  {lotData?.chamber}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                  {t("lot")}
                </Typography>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  {lotData?.id}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                  {t("species")}
                </Typography>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  {lotData?.species}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                  {t("program")}
                </Typography>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  {lotData?.program_name}
                </Typography>
              </Box>
            </Box>
            <Chart
              ref={chartRef}
              height="500px"
              options={options}
              series={series}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {series.map((series, index) => (
              <>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        onChange={() => toggleSeries(series.name)}
                        sx={{
                          "&.Mui-checked": {
                            borderColor: colors[index],
                            backgroundColor: colors[index],
                            border: "none",
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")`,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 12 }}
                        component="span"
                      >
                        {series.name}
                      </Typography>
                    }
                  />
                </Box>
              </>
            ))}
          </Box>
        </Paper>
      </Box>
    </ArgonBox>
  );
};
