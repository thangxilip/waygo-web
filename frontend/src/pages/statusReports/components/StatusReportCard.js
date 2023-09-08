import { Card, CardContent, CardHeader, useMediaQuery } from "@mui/material";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import React from "react";
import { getChamberStatus } from "utils/helper";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const typographyProps = {
  fontWeight: "medium",
  color: "white",
  display: "flex",
};

const TypoGraphyLabel = styled(ArgonTypography)({
  color: "lightgray",
  fontSize: "1.2rem",
  marginRight: "1rem",
  whiteSpace: "nowrap",
});

const StatusReportCard = ({ data }) => {
  const status = getChamberStatus(data?.status_code);
  const isMobile = useMediaQuery("(max-width:475px)");

  return (
    <Card
      sx={{
        flex: 1,
        minWidth: isMobile ? "260px" : "350px",
        backgroundColor: status === "Idle" ? "#4fa7b7" : "green",
        boxShadow: "0px 0px 5px 2px lightgray",
        borderRadius: "5px",
        minHeight: "421px",
        maxHeight: "421px",
      }}
    >
      <CardHeader
        sx={{ textAlign: "center" }}
        title={
          <ArgonTypography {...typographyProps}>
            Chamber {data.chamber}
          </ArgonTypography>
        }
      />
      <CardContent>
        <ArgonTypography {...typographyProps}>
          <TypoGraphyLabel>Last Report:</TypoGraphyLabel>
        </ArgonTypography>
        <ArgonTypography {...typographyProps}>
          <TypoGraphyLabel>Status:</TypoGraphyLabel>
          {getChamberStatus(data?.status_code)}
        </ArgonTypography>
        {status !== "Idle" ? (
          <>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>Species:</TypoGraphyLabel>
              {data?.lot?.species}
            </ArgonTypography>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>Quantity:</TypoGraphyLabel>
              {data?.lot?.quantity}
            </ArgonTypography>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>RH:</TypoGraphyLabel>
              {data?.latest_lot_data?.rh}
            </ArgonTypography>
            <ArgonBox display="flex" justifyContent="space-between">
              <ArgonTypography {...typographyProps}>
                <TypoGraphyLabel>DBTI:</TypoGraphyLabel>
                {data?.latest_lot_data?.dbt1}
              </ArgonTypography>
              <ArgonTypography {...typographyProps}>
                <TypoGraphyLabel>WBTI:</TypoGraphyLabel>
                {data?.latest_lot_data?.wbt1}
              </ArgonTypography>
            </ArgonBox>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>AMC:</TypoGraphyLabel>
              {data?.latest_lot_data?.amc1}
            </ArgonTypography>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>Current Command:</TypoGraphyLabel>
              {data?.latest_lot_data?.command_name}
            </ArgonTypography>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>Start time:</TypoGraphyLabel>
              {data?.lot?.start_time
                ? dayjs(data?.lot?.start_time).format("YYYY-MM-DD")
                : ""}
            </ArgonTypography>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>Time ellapsed:</TypoGraphyLabel>
              {data?.lot?.duration}
            </ArgonTypography>
          </>
        ) : (
          <>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>Last completed lot:</TypoGraphyLabel>
              {data?.last_completed_lot}
            </ArgonTypography>
            <ArgonTypography {...typographyProps}>
              <TypoGraphyLabel>Idle for:</TypoGraphyLabel>
              {data?.server_time
                ? `${dayjs(data?.server_time).fromNow(true)}`
                : ""}
            </ArgonTypography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusReportCard;
