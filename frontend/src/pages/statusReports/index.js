import React from "react";
import ArgonBox from "components/ArgonBox";
import { Endpoints } from "utils/httpServices";
import Table from "./components/Table";
import dayjs from "dayjs";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import {
  secondsToDuration,
  getChamberStatus,
  getChamberStatusClass,
} from "utils/helper";
import { useTranslation } from "react-i18next";
import localeVi from "dayjs/locale/vi";
import localeEn from "dayjs/locale/en";

// var thresholds = [
//   { l: "s", r: 1 },
//   { l: "ss", r: 59, d: "second" },
//   { l: "m", r: 1 },
//   { l: "mm", r: 59, d: "minute" },
//   { l: "h", r: 1 },
//   { l: "hh", r: 23, d: "hour" },
//   { l: "d", r: 1 },
//   { l: "dd", r: 29, d: "day" },
//   { l: "M", r: 1 },
//   { l: "MM", r: 11, d: "month" },
//   { l: "y", r: 1 },
//   { l: "yy", d: "year" },
// ];
// var config = {
//   strict: true,
//   thresholds: thresholds,
//   rounding: Math.floor
// };

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

const StatusReports = () => {
  const { t, i18n } = useTranslation();

  const columns = [
    {
      field: "chamber",
      headerName: t("chamber"),
      width: 120,
      type: "string",
      sortable: false,
      filterable: false,
    },
    {
      field: "status_code",
      headerName: t("status"),
      width: 140,
      sortable: false,
      filterable: true,
      type: "string",
      renderCell: ({ row }) => (
        <Tooltip
          arrow={false}
          title={getChamberStatus(row.status_code)}
          placement="right"
        >
          <Chip
            size="small"
            sx={{ color: "white.main", fontWeight: 600, width: 100 }}
            color={getChamberStatusClass(row.status_code)}
            label={getChamberStatus(row.status_code)}
          />
        </Tooltip>
      ),
    },
    {
      field: "last_complete",
      headerName: t("lastComplete"),
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) =>
        row.last_completed_lot?.complete_time &&
        dayjs(row.last_completed_lot?.complete_time).format(
          "DD/MM/YYYY, HH:mm"
        ),
    },
    {
      field: "since_last_complete",
      headerName: t("sinceLastComplete"),
      sortable: false,
      width: 200,
      filterable: false,
      renderCell: ({ row }) => {
        if (row.last_completed_lot?.complete_time) {
          let day = dayjs(row.last_completed_lot?.complete_time);
          return day.locale(i18n.language).fromNow();
        }
      },
    },
    {
      field: "last_report",
      headerName: t("lastReport"),
      sortable: false,
      width: 200,
      filterable: false,
      renderCell: ({ row }) =>
        dayjs(row.server_time).format("DD/MM/YYYY, HH:mm"),
    },
    {
      field: "since_last_report",
      headerName: t("sinceLastReport"),
      sortable: false,
      width: 200,
      filterable: false,
      renderCell: ({ row }) => {
        let day = dayjs(row.server_time);
        return day.locale(i18n.language).fromNow();
      },
    },
    {
      field: "lot_id",
      headerName: t("lotId"),
      width: 155,
      sortable: false,
      filterable: false,
      valueGetter: ({ row }) => row.lot?.id,
      renderCell: ({ row }) => {
        return row.lot?.id && (
          <Tooltip arrow={false} title={row.lot?.id} placement="right">
            <div>{row.lot?.id}</div>
          </Tooltip>
        );
      },
    },
    {
      field: "lot_species",
      headerName: t("species"),
      sortable: false,
      filterable: false,
      width: 170,
      valueGetter: ({ row }) => row.lot?.species,
      renderCell: ({ row }) => {
        return row.lot?.species && (
          <Tooltip arrow={false} title={row.lot?.species} placement="right">
            <div>{row.lot?.species}</div>
          </Tooltip>
        );
      },
    },
    {
      field: "lot_quantity",
      headerName: t("quantity"),
      sortable: false,
      width: 120,
      filterable: false,
      valueGetter: ({ row }) => row.lot?.quantity,
    },
    {
      field: "latest_lot_data_amc",
      headerName: t("amc"),
      sortable: false,
      width: 80,
      filterable: false,
      valueGetter: ({ row }) => row.latest_lot_data?.amc,
    },
    {
      field: "latest_lot_data_dbt",
      headerName: t("dbt"),
      sortable: false,
      width: 80,
      filterable: false,
      valueGetter: ({ row }) => row.latest_lot_data?.dbt,
    },
    {
      field: "latest_lot_data_wbt",
      headerName: t("wbt"),
      sortable: false,
      width: 80,
      filterable: false,
      valueGetter: ({ row }) => row.latest_lot_data?.wbt,
    },
    {
      field: "latest_lot_data_command_name",
      headerName: t("command"),
      sortable: false,
      width: 140,
      filterable: false,
      valueGetter: ({ row }) => row.latest_lot_data?.command_name,
      renderCell: ({ row }) => {
        return row.latest_lot_data?.command_name && (
          <Tooltip arrow={false} title={row.latest_lot_data?.command_name} placement="right">
            <div>{row.latest_lot_data?.command_name}</div>
          </Tooltip>
        );
      },
    },
    {
      field: "total_time",
      headerName: t("totalTime"),
      sortable: false,
      width: 140,
      filterable: false,
      renderCell: ({ row }) =>
        row.lot?.start_time &&
        secondsToDuration(dayjs().diff(dayjs(row.lot?.start_time), "second")),
    },
  ];

  return (
    <ArgonBox sx={{ height: "100%", width: "100%" }}>
      <Table columns={columns} url={Endpoints.statusReport} />
    </ArgonBox>
  );
};

export default StatusReports;
