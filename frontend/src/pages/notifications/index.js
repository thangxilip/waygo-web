import React from "react";
import ArgonBox from "components/ArgonBox";
import { Endpoints } from "utils/httpServices";
import Table from "./components/Table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const { t, i18n } = useTranslation();

  const columns = [
    {
      field: "index",
      headerName: t('lineNo'),
      width: 60,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        const rowNo = params.api.getRowIndexRelativeToVisibleRows(params.row.id);
        const pagination = params.api.state.pagination.paginationModel;
        const offset = pagination.page * pagination.pageSize + 1;
        return !isNaN(rowNo) ? rowNo + offset : ''
      },
    },
    {
      field: "from_chamber",
      headerName: t("fromChamber"),
      width: 150,
      type: "string",
      sortable: false,
      filterable: true,
    },
    {
      field: "time",
      headerName: t("time"),
      width: 180,
      sortable: false,
      filterable: true,
      type: "date",
      valueGetter: ({ row }) => new Date(row.time),
      renderCell: ({ row }) =>
        row.time &&
        dayjs(row.time).format(
          "DD/MM/YYYY, HH:mm"
        ),
    },
    {
      field: "type",
      headerName: t("type"),
      sortable: false,
      width: 160,
      filterable: true,
      type: "string",
      valueGetter: ({ row }) => row.type,
    },
    {
      field: "details",
      headerName: t("details"),
      sortable: false,
      flex: 1,
      cellClassName: 'long-text',
      filterable: false,
      valueGetter: ({ row }) => row.details,
    },
  ];

  return (
    <ArgonBox sx={{ height: "100%", width: "100%" }}>
      <Table columns={columns} url={Endpoints.notifications} />
    </ArgonBox>
  );
};

export default Notifications;
