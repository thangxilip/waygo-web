import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import { Endpoints } from "utils/httpServices";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import dayjs from "dayjs";

export const LotsDataTable = ({ lotID }) => {
  const navigate = useNavigate();

  const columns = [
    {
      field: "amc",
      headerName: "Amc",
      width: 110,
      sortable: false,
      filterable: false,
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
      field: "dbt1",
      headerName: "dbt1",
      // flex: 1,
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "dbt2",
      headerName: "dbt2",
      type: "number",
      // flex: 1,
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "details",
      headerName: "details",
      sortable: false,
      // flex: 1,
      width: 100,
      filterable: false,
    },
    {
      field: "fan_ccw",
      headerName: "fan_ccw",
      sortable: false,
      // flex: 1,
      width: 90,
      filterable: false,
    },
    {
      field: "fan_cw",
      headerName: "fan_cw",
      sortable: false,
      // flex: 1,
      width: 90,
      filterable: false,
    },
    {
      field: "flaps",
      headerName: "flaps",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "heat",
      headerName: "heat",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "id",
      headerName: "id",
      sortable: false,
      // flex: 1,
      width: 100,
      filterable: false,
    },
    {
      field: "mc1",
      headerName: "mc1",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc2",
      headerName: "mc2",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc3",
      headerName: "mc3",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc4",
      headerName: "mc4",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc5",
      headerName: "mc5",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc6",
      headerName: "mc6",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc7",
      headerName: "mc7",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "mc8",
      headerName: "mc8",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "reserved",
      headerName: "reserved",
      sortable: false,
      // flex: 1,
      width: 100,
      filterable: false,
    },
    {
      field: "rh",
      headerName: "rh",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "spray",
      headerName: "spray",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "time",
      headerName: "time",
      sortable: false,
      // flex: 1,
      width: 200,
      filterable: false,
      renderCell: ({ row }) => dayjs(row?.time).format("YYYY-MM-DD HH:mm a"),
    },
    {
      field: "wbt1",
      headerName: "wbt1",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "wbt2",
      headerName: "wbt2",
      sortable: false,
      // flex: 1,
      width: 80,
      filterable: false,
    },
    {
      field: "wood_temp1",
      headerName: "wood_temp1",
      sortable: false,
      // flex: 1,
      width: 120,
      filterable: false,
    },
    {
      field: "wood_temp2",
      headerName: "wood_temp2",
      sortable: false,
      // flex: 1,
      width: 120,
      filterable: false,
    },
  ];

  return (
    <ArgonBox sx={{ height: "100vh", width: "100%" }} mt={8}>
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
      <Table columns={columns} url={`${Endpoints.lots}${lotID}/lot-data/`} />
    </ArgonBox>
  );
};
