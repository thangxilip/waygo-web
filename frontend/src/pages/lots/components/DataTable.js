import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import { Endpoints } from "utils/httpServices";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "react-i18next";

export const LotsDataTable = ({ lotID }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const columns = [
    {
      field: "id",
      headerName: t("id"),
      sortable: false,
      width: 100,
      filterable: false,
    },
    {
      field: "time",
      headerName: t("time"),
      sortable: false,
      width: 200,
      filterable: false,
      renderCell: ({ row }) => dayjs(row?.time).format("YYYY/MM/DD, HH:mm"),
    },

    {
      field: "command_name",
      headerName: t("command"),
      width: 130,
      sortable: false,
      filterable: false,
    },
    {
      field: "amc",
      headerName: t("amc"),
      width: 110,
      sortable: false,
      filterable: false,
    },
    {
      field: "rh",
      headerName: t("rh"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "dbt1",
      headerName: t("dbt1"),
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "dbt2",
      headerName: t("dbt2"),
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "targetdbt",
      headerName: t("targetdbt"),
      width: 120,
      sortable: false,
      filterable: false,
    },
    {
      field: "wbt1",
      headerName: t("wbt1"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "wbt2",
      headerName: t("wbt2"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "targetwbt",
      headerName: t("targetwbt"),
      width: 120,
      sortable: false,
      filterable: false,
    },
    {
      field: "mc1",
      headerName: t("mc1"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "mc2",
      headerName: t("mc2"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "mc3",
      headerName: t("mc3"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "mc4",
      headerName: t("mc4"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "mc5",
      headerName: t("mc5"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "mc6",
      headerName: t("mc6"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "mc7",
      headerName: t("mc7"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "mc8",
      headerName: t("mc8"),
      sortable: false,
      width: 80,
      filterable: false,
    },
    {
      field: "wood_temp1",
      headerName: t("woodTemp1"),
      sortable: false,
      width: 130,
      filterable: false,
    },
    {
      field: "wood_temp2",
      headerName: t("woodTemp2"),
      sortable: false,
      width: 130,
      filterable: false,
    },

    {
      field: "flaps",
      headerName: t("flaps"),
      sortable: false,
      width: 80,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.flaps === 1} />,
    },
    {
      field: "heat",
      headerName: t("heat"),
      sortable: false,
      width: 80,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.heat === 1} />,
    },
    {
      field: "spray",
      headerName: t("spray"),
      sortable: false,
      width: 80,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.spray === 1} />,
    },
    {
      field: "fan_cw",
      headerName: t("fanCW"),
      sortable: false,
      width: 90,
      filterable: false,
      renderCell: ({ row }) => <Checkbox readOnly checked={row.fan_cw === 1} />,
    },
    {
      field: "fan_ccw",
      headerName: t("fanCCW"),
      sortable: false,
      width: 90,
      filterable: false,
      renderCell: ({ row }) => (
        <Checkbox readOnly checked={row.fan_ccw === 1} />
      ),
    },
    {
      field: "details",
      headerName: t("details"),
      sortable: false,
      // flex: 1,
      width: 150,
      filterable: false,
    },
    {
      field: "reserved",
      headerName: t("reserved"),
      sortable: false,
      // flex: 1,
      width: 150,
      filterable: false,
    },
  ];

  return (
    <ArgonBox sx={{ width: "100%" }}>
      <ArgonBox mb={2} display="flex" justifyContent="space-between">
        <ArgonButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIosIcon sx={{ fill: "#000" }} />
          {t("back")}
        </ArgonButton>
      </ArgonBox>
      <Table
        type="lot_data"
        lotID={lotID}
        columns={columns}
        url={`${Endpoints.lots}${lotID}/lot-data/`}
        pageSize={50}
      />
    </ArgonBox>
  );
};
