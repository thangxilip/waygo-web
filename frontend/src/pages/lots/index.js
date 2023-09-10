import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonTypography from "components/ArgonTypography";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Endpoints } from "utils/httpServices";
import { LotsDataTable } from "./components/DataTable";
import { LotsDataPlot } from "./components/DataPlot";
import Table from "./components/Table";
import { Button, Paper, Box, Typography } from "@mui/material";
import TableViewIcon from '@mui/icons-material/TableView';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import dayjs from 'dayjs';

export const Lots = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, view } = useParams();

  const name = location.pathname.split("/").slice(1);

  const columns = [
    {
      field: "actions",
      type: "actions",
      sortable: false,
      width: 240,
      renderCell: ({ row }) => (
        <ArgonBox gap="5px" sx={{ width: "100%", display: "flex" }}>
          <Button
            startIcon={<TableViewIcon/>}
            onClick={() => {
              navigate(`/${name[0]}/data/${row?.id}`);
            }}
          >Data table</Button>
          <Button
          startIcon={<BubbleChartIcon/>}
            onClick={() => {
              navigate(`/${name[0]}/plot/${row?.id}`);
            }}
          >Data plot</Button>
        </ArgonBox>
      ),
    },
    {
      field: "chamber",
      headerName: "Chamber",
      width: 140,
      type: "string",
      sortable: false,
    },
    {
      field: "id",
      headerName: "Lot ID",
      // flex: 1,
      width: 155,
      sortable: false,
      filterable: false,
    },
    
    {
      field: "program_name",
      headerName: "Program",
      // flex: 1,
      width: 210,
      sortable: false,
      filterable: false,
    },
    {
      field: "total_commands",
      headerName: "Commands",
      sortable: false,
      // flex: 1,
      width: 110,
      filterable: false,
    },
    {
      field: "species",
      headerName: "Species",
      sortable: false,
      // flex: 1,
      width: 135,
      type: "string",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      sortable: false,
      // flex: 1,
      width: 110,
      filterable: false,
    },
    {
      field: "start_time",
      headerName: "Start Time",
      // flex: 1,
      width: 150,
      sortable: false,
      type: "date",
      valueGetter: (params) => new Date(params.row.start_time),
      renderCell: ({ row }) => dayjs(row.start_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "complete_time",
      headerName: "Complete Time",
      sortable: false,
      // flex: 1,
      width: 170,
      type: "date",
      valueGetter: (params) =>
        params.row.complete_time && new Date(params.row.complete_time),
      renderCell: ({ row }) => row.complete_time && dayjs(row.complete_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "duration",
      headerName: "Ellapsed",
      sortable: false,
      // flex: 1,
      width: 140,
      filterable: false,
    },
    
  ];


  const renderContent = () => {
    switch (view) {
      case "data":
        return <LotsDataTable lotID={id} />;
      case "plot":
        return <LotsDataPlot lotID={id} />;
      default:
        return (
            <Table
              type="lot"
              columns={columns}
              url={Endpoints.lots}
              pageSize={20}
            />
        );
    }
  };

  return (
    <ArgonBox sx={{ height: "100%", width: "100%" }}>
      {renderContent()}
    </ArgonBox>
  );
};
