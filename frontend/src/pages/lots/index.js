import ArgonBox from "components/ArgonBox";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Endpoints } from "utils/httpServices";
import { LotsDataTable } from "./components/DataTable";
import { LotsDataPlot } from "./components/DataPlot";
import Table from "./components/Table";
import { Button } from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import dayjs from "dayjs";
import { secondsToDuration } from "utils/helper";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";

export const Lots = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, view } = useParams();
  const { t } = useTranslation();

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
            startIcon={<TableViewIcon />}
            onClick={() => {
              navigate(`/${name[0]}/data/${row?.id}`);
            }}
          >
            {t("dataTable")}
          </Button>
          <Button
            startIcon={<BubbleChartIcon />}
            onClick={() => {
              navigate(`/${name[0]}/plot/${row?.id}`);
            }}
          >
            {t("dataPlot")}
          </Button>
        </ArgonBox>
      ),
    },
    {
      field: "chamber",
      headerName: t("chamber"),
      width: 140,
      type: "string",
      sortable: false,
    },
    {
      field: "id",
      headerName: t("lotId"),
      width: 155,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        return row.id && (
          <Tooltip arrow={false} title={row.id} placement="right">
            <div>{row.id}</div>
          </Tooltip>
        );
      },
    },

    {
      field: "program_name",
      headerName: t("program"),
      width: 210,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        return row.program_name && (
          <Tooltip arrow={false} title={row.program_name} placement="right">
            <div>{row.program_name}</div>
          </Tooltip>
        );
      },
    },
    {
      field: "total_commands",
      headerName: t("commands"),
      sortable: false,
      width: 110,
      filterable: false,
    },
    {
      field: "species",
      headerName: t("species"),
      sortable: false,
      width: 135,
      type: "string",
      renderCell: ({ row }) => {
        return row.species && (
          <Tooltip arrow={false} title={row.species} placement="right">
            <div>{row.species}</div>
          </Tooltip>
        );
      },
    },
    {
      field: "quantity",
      headerName: t("quantity"),
      sortable: false,
      width: 140,
      filterable: false,
    },
    {
      field: "start_time",
      headerName: t("startTime"),
      width: 170,
      sortable: false,
      type: "date",
      valueGetter: (params) => new Date(params.row.start_time),
      renderCell: ({ row }) =>
        dayjs(row.start_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "complete_time",
      headerName: t("completeTime"),
      sortable: false,
      width: 190,
      type: "date",
      valueGetter: (params) =>
        params.row.complete_time && new Date(params.row.complete_time),
      renderCell: ({ row }) =>
        row.complete_time &&
        dayjs(row.complete_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "duration",
      headerName: t("ellapsed"),
      sortable: false,
      width: 140,
      filterable: false,
      renderCell: ({ row }) =>
        row.duration !== null && secondsToDuration(row.duration)
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
