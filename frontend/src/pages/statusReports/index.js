import React from "react";
import ArgonBox from "components/ArgonBox";
import StatusReportCard from "./components/StatusReportCard";
import { Endpoints } from "utils/httpServices";
import { useQuery } from "@tanstack/react-query";
import { Grid } from "@mui/material";

const StatusReports = () => {
  const { data, isLoading } = useQuery([Endpoints.statusReport], {
    enabled: true,
  });
  return (
    <ArgonBox display="flex" flexDirection="row" flexWrap="wrap" gap="20px">
      <Grid container spacing={3}>
        {!isLoading &&
          data?.map((item) => (
            <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
              <StatusReportCard data={item} key={item.id} />
            </Grid>
          ))}
      </Grid>
    </ArgonBox>
  );
};

export default StatusReports;
