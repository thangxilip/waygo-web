import React from "react";
import ArgonBox from "components/ArgonBox";
import { Endpoints } from "utils/httpServices";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "./components/Table";
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';

const StatusReports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const columns = [
    {
      field: "chamber",
      headerName: "Chamber",
      width: 120,
      type: "string",
      sortable: false,
      filterable: false
    },
    {
      field: "status_code",
      headerName: "Status",
      // flex: 1,
      width: 120,
      sortable: false,
      filterable: true,
      // type: "number",
      type: "string",
      renderCell: ({ row }) => <Chip size="small" sx={{color: 'white.main', fontWeight: 600, width: 90}} color={row.status_code === 0 ? 'success' : 'info'} label={row.status_code === 0 ? 'Operating' : 'Idle'}/>,
    },
    {
      field: "last_complete",
      headerName: "Last Complete",
      // flex: 1,
      width: 160,
      sortable: false,
      filterable: false,
      type: "date",
      valueGetter: (params) => params.row.lot?.complete_time && new Date(params.row.lot?.complete_time),
      renderCell: ({ row }) => row.lot?.complete_time && dayjs(row.lot?.complete_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "since_last_complete",
      headerName: "Since Last Complete",
      sortable: false,
      // flex: 1,
      width: 200,
      filterable: false,
      // renderCell: ({ row }) => row.lot?.complete_time && dayjs(row.lot?.complete_time).fromNow(true),
    },
    {
      field: "server_time",
      headerName: "Last Report",
      sortable: false,
      // flex: 1,
      width: 200,
      type: "date",
      filterable: false,
      valueGetter: (params) => new Date(params.row.server_time),
      renderCell: ({ row }) => dayjs(row.server_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "since_last_report",
      headerName: "Since Last Report",
      sortable: false,
      // flex: 1,
      width: 200,
      filterable: false,
      // valueGetter: (params) => new Date(params.row.server_time),
      // renderCell: ({ row }) => dayjs(row.server_time).fromNow(true),
    },
    {
      field: "lot_id",
      headerName: "Lot ID",
      // flex: 1,
      width: 150,
      sortable: false,
      filterable: false,
      // type: "date",
      // valueGetter: (params) => new Date(params.row.start_time),
      // renderCell: ({ row }) => dayjs(row.start_time).format("DD/MM/YYYY, HH:mm"),
      valueGetter: ({row}) => row.lot?.id
    },
    {
      field: "lot_species",
      headerName: "Species",
      sortable: false,
      filterable: false,
      // flex: 1,
      width: 170,
      valueGetter: ({row}) => row.lot?.species
    },
    {
      field: "lot_quantity",
      headerName: "Quantity",
      sortable: false,
      // flex: 1,
      width: 120,
      filterable: false,
      valueGetter: ({row}) => row.lot?.quantity
    },
    {
      field: "latest_lot_data_amc",
      headerName: "AMC",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
      valueGetter: ({row}) => row.latest_lot_data?.amc
    },
    {
      field: "latest_lot_data_dbt",
      headerName: "DBT",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
      valueGetter: ({row}) => row.latest_lot_data?.dbt
    },
    {
      field: "latest_lot_data_wbt",
      headerName: "WBT",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
      valueGetter: ({row}) => row.latest_lot_data?.wbt
    },
    {
      field: "total_time",
      headerName: "Total Time",
      sortable: false,
      // flex: 1,
      width: 140,
      filterable: false,
      valueGetter: ({row}) => row.lot?.duration
    },

  ];

  return (
    <ArgonBox sx={{ height: "100%", width: "100%" }}>
      <Table
          columns={columns}
          url={Endpoints.statusReport}
      />
    </ArgonBox>
  );
};

export default StatusReports;
