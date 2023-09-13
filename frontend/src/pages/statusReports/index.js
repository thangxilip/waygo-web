import React from "react";
import ArgonBox from "components/ArgonBox";
import { Endpoints } from "utils/httpServices";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "./components/Table";
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import relativeTime from "dayjs/plugin/relativeTime";
import { secondsToDuration } from 'utils/helper';

dayjs.extend(relativeTime);

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
      width: 120,
      sortable: false,
      filterable: true,
      type: "string",
      renderCell: ({ row }) => <Chip size="small" sx={{color: 'white.main', fontWeight: 600, width: 90}} color={row.status_code === 0 ? 'success' : 'info'} label={row.status_code === 0 ? 'Operating' : 'Idle'}/>,
    },
    {
      field: "last_complete",
      headerName: "Last Complete",
      width: 160,
      sortable: false,
      filterable: false,
      // type: "date",
      // valueGetter: ({ row }) => row.last_completed_lot?.complete_time && new Date(row.last_completed_lot?.complete_time),
      // renderCell: ({ row }) => row.last_completed_lot?.complete_time && dayjs(row.last_completed_lot?.complete_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "since_last_complete",
      headerName: "Since Last Complete",
      sortable: false,
      // flex: 1,
      width: 200,
      filterable: false,
      // renderCell: ({ row }) => row.last_completed_lot?.complete_time && dayjs(row.last_completed_lot?.complete_time).fromNow(true),
    },
    {
      field: "last_report",
      headerName: "Last Report",
      sortable: false,
      width: 200,
      // type: "date",
      filterable: false,
      // valueGetter: (params) => new Date(params.row.server_time),
      // renderCell: ({ row }) => dayjs(row.server_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "since_last_report",
      headerName: "Since Last Report",
      sortable: false,
      width: 200,
      filterable: false,
      // renderCell: ({ row }) => dayjs(row.server_time).fromNow(true),
    },
    {
      field: "lot_id",
      headerName: "Lot ID",
      width: 150,
      sortable: false,
      filterable: false,
      valueGetter: ({row}) => row.lot?.id
    },
    {
      field: "lot_species",
      headerName: "Species",
      sortable: false,
      filterable: false,
      width: 170,
      valueGetter: ({row}) => row.lot?.species
    },
    {
      field: "lot_quantity",
      headerName: "Quantity",
      sortable: false,
      width: 120,
      filterable: false,
      valueGetter: ({row}) => row.lot?.quantity
    },
    {
      field: "latest_lot_data_amc",
      headerName: "AMC",
      sortable: false,
      width: 80,
      filterable: false,
      valueGetter: ({row}) => row.latest_lot_data?.amc
    },
    {
      field: "latest_lot_data_dbt",
      headerName: "DBT",
      sortable: false,
      width: 80,
      filterable: false,
      valueGetter: ({row}) => row.latest_lot_data?.dbt
    },
    {
      field: "latest_lot_data_wbt",
      headerName: "WBT",
      sortable: false,
      width: 80,
      filterable: false,
      valueGetter: ({row}) => row.latest_lot_data?.wbt
    },
    {
      field: "total_time",
      headerName: "Total Time",
      sortable: false,
      width: 140,
      filterable: false,
      renderCell: ({ row }) => row.lot?.start_time && secondsToDuration(dayjs().diff(dayjs(row.lot?.start_time), 'second'))
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
