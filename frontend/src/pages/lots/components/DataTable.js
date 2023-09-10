import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import { Endpoints } from "utils/httpServices";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import dayjs from "dayjs";
import Checkbox from '@mui/material/Checkbox';

export const LotsDataTable = ({ lotID }) => {
  const navigate = useNavigate();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      sortable: false,
      // flex: 1,
      width: 100,
      filterable: false,
    },
    {
      field: "time",
      headerName: "Time",
      sortable: false,
      // flex: 1,
      width: 200,
      filterable: false,
      renderCell: ({ row }) => dayjs(row?.time).format("YYYY-MM-DD HH:mm"),
    },
    
    {
      field: "command_name",
      headerName: "Command",
      // flex: 1,
      width: 130,
      sortable: false,
      filterable: false,
    },
    {
      field: "amc",
      headerName: "AMC",
      width: 110,
      sortable: false,
      filterable: false,
    },
    {
      field: "rh",
      headerName: "RH",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "dbt1",
      headerName: "DBT1",
      // flex: 1,
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "dbt2",
      headerName: "DBT2",
      type: "number",
      // flex: 1,
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "wbt1",
      headerName: "WBT1",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "wbt2",
      headerName: "WBT2",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc1",
      headerName: "MC1",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc2",
      headerName: "MC2",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc3",
      headerName: "MC3",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc4",
      headerName: "MC4",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc5",
      headerName: "MC5",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc6",
      headerName: "MC6",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc7",
      headerName: "MC7",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc8",
      headerName: "MC8",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "wood_temp1",
      headerName: "Wood temp 1",
      sortable: false,
      // flex: 1,
      width: 130,
      filterable: false,
    },
    {
      field: "wood_temp2",
      headerName: "Wood temp 2",
      sortable: false,
      // flex: 1,
      width: 130,
      filterable: false,
    },
    
    {
      field: "flaps",
      headerName: "Flaps",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.flaps === 1}/>,
    },
    {
      field: "heat",
      headerName: "Heat",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.heat === 1}/>,
    },
    {
      field: "spray",
      headerName: "Spray",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.spray === 1}/>,
    },
    {
      field: "fan_cw",
      headerName: "Fan CW",
      sortable: false,
      // flex: 1,
      width: 90,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.fan_cw === 1}/>,
    },
    {
      field: "fan_ccw",
      headerName: "Fan CCW",
      sortable: false,
      // flex: 1,
      width: 90,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.fan_ccw === 1}/>,
    },
    {
      field: "details",
      headerName: "Details",
      sortable: false,
      // flex: 1,
      width: 100,
      filterable: false,
    },
    {
      field: "reserved",
      headerName: "Reserved",
      sortable: false,
      // flex: 1,
      width: 100,
      filterable: false,
    },
  ];

  return (
    <ArgonBox sx={{  width: "100%" }}>
      <ArgonBox mb={2} display="flex" justifyContent="space-between">
        <ArgonButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIosIcon sx={{ fill: "#000" }} />
          Back
        </ArgonButton>
      </ArgonBox>
      <Table type="lot_data" lotID={lotID} columns={columns} url={`${Endpoints.lots}${lotID}/lot-data/`} pageSize={50}/>
    </ArgonBox>
  );
};
