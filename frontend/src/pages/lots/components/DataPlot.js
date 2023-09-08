import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "utils/httpServices";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArgonButton from "components/ArgonButton";
import { useNavigate } from "react-router-dom";
import { useArgonController } from "context";
import print from "assets/images/print.svg";
import dayjs from "dayjs";

const keys = ["rh", "amc", "wbt1", "dbt1", "wood_temp1"];

export const LotsDataPlot = ({ lotID }) => {
  const navigate = useNavigate();
  const [controller] = useArgonController();
  const { darkMode } = controller;

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    theme: {
      mode: "light",
      palette: "#fff",
    },
    chart: {
      type: "line",
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
    },
    tooltip: {
      x: {
        formatter: function (args) {
          return dayjs(args).format("D-MMM-YY hh:mm a");
        },
        show: true,
      },
    },
    xaxis: {
      type: "datetime",
      tickAmount: 24, // Display 24 ticks for 24 hours (one tick per hour)
    },
    colors: ["#2E93fA", "#66DA26", "#546E7A", "#7be3af", "#c5206ab5"],
  });

  const typographyProps = {
    fontWeight: "medium",
  };
  const { data: lotData } = useQuery([`${Endpoints.lots}${lotID}/`]);
  const { data } = useQuery([
    `${Endpoints.lots}${lotID}/lot-data/`,
    { get_all: true },
  ]);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      theme: { ...prev.theme, mode: darkMode ? "dark" : "light" },
    }));
  }, [darkMode]);

  useEffect(() => {
    if (data) {
      const temp = data?.reduce((acc, curr) => {
        keys.forEach((key) => {
          const time = dayjs(curr.time);
          const startOfHour = time
            .startOf("hour")
            .format("YYYY-MM-DD HH:mm:ss");
          const obj = {
            x: startOfHour, // or you can use endOfHour if you prefer
            y: curr[key],
          };

          if (acc?.[key]) {
            acc[key].push(obj);
          } else {
            acc[key] = [obj];
          }
        });
        return acc;
      }, {});

      setSeries(Object.entries(temp).map(([k, v]) => ({ name: k, data: v })));
    }
  }, [data]);

  return (
    <ArgonBox>
      <ArgonButton
        onClick={() => {
          navigate(-1);
        }}
        sx={{ marginBottom: 2 }}
      >
        <ArrowBackIosIcon sx={{ fill: "#000" }} />
        Back
      </ArgonButton>
      <Chart height="500px" options={options} series={series} />
      <ArgonBox mt={2}>
        <ArgonTypography {...typographyProps}>
          Chamber: {lotData?.chamber}
        </ArgonTypography>
        <ArgonTypography {...typographyProps}>
          Lot ID: {lotData?.id}
        </ArgonTypography>
        <ArgonTypography {...typographyProps}>
          Species: {lotData?.species}
        </ArgonTypography>
        <ArgonTypography {...typographyProps}>
          Program Name: {lotData?.program_name}
        </ArgonTypography>
        <ArgonTypography {...typographyProps}>
          Quantity: {lotData?.quantity}
        </ArgonTypography>
      </ArgonBox>
    </ArgonBox>
  );
};
