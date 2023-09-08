import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Endpoints } from "utils/httpServices";
import { LotsDataTable } from "./components/DataTable";
import { LotsDataPlot } from "./components/DataPlot";
import Table from "./components/Table";

export const Lots = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, view } = useParams();

  const name = location.pathname.split("/").slice(1);

  const columns = [
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
      field: "start_time",
      headerName: "Start Time",
      // flex: 1,
      width: 150,
      sortable: false,
      type: "date",
      valueGetter: (params) => new Date(params.row.start_time),
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
      field: "duration",
      headerName: "Ellapsed",
      sortable: false,
      // flex: 1,
      width: 140,
      filterable: false,
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
    },
    {
      field: "actions",
      type: "actions",
      sortable: false,
      width: 270,
      renderCell: ({ row }) => (
        <ArgonBox gap="10px" sx={{ width: "100%", display: "flex" }}>
          <ArgonButton
            onClick={() => {
              navigate(`/${name[0]}/data/${row?.id}`);
            }}
          >
            Data table
          </ArgonButton>
          <ArgonButton
            onClick={() => {
              navigate(`/${name[0]}/plot/${row?.id}`);
            }}
          >
            Data plot
          </ArgonButton>
        </ArgonBox>
      ),
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
          <>
            <Table
              columns={columns}
              url={
                location.pathname === "/ongoing-lots"
                  ? Endpoints.ongoingLots
                  : Endpoints.historicalLots
              }
            />
          </>
        );
    }
  };

  return (
    <ArgonBox sx={{ height: "100%", width: "100%" }}>
      {renderContent()}
    </ArgonBox>
  );
};
