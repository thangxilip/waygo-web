import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ExportToolBar from "examples/ExportToolBar";
import { Endpoints } from "utils/httpServices";
import { Button, Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  unstable_composeClasses as composeClasses,
  Badge,
} from "@mui/material";
import {
  DataGrid,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  useGridApiContext,
  useGridRootProps,
  getDataGridUtilityClass,
  gridClasses,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import styled from "@emotion/styled";
import { filterOpertorMap } from "utils/helper";
import Duration from "./Duration";
import httpService from "utils/httpServices";
import { Card, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const useUtilityClasses = (ownerState) => {
  const { classes } = ownerState;

  const slots = {
    icon: ["filterIcon"],
    toolbar: [ExportToolBar],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 5,
    minWidth: 15,
    height: 15,
    fontSize: "0.5rem",
    padding: "0 4px",
  },
}));

const Table = ({
  columns,
  url,
  queryParams = {},
  queryEnabled = true,
  pageSize = 20,
  type,
  lotID,
}) => {
  const { t } = useTranslation();
  const [filterButtonEl, setFilterButtonEl] = React.useState(null);
  const [queryOptions, setQueryOptions] = useState({});
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: pageSize,
  });

  const query = useMemo(() => {
    const filters =
      queryOptions?.filterModel?.items.filter((item) => !!item.value) || [];
    const queryParams = [];
    let params = {
      queryParams,
      page_size: paginationModel.pageSize,
      page: paginationModel.page + 1,
    };
    filters?.forEach((filter) => {
      let key = "";
      if (filter.operator !== "=") key = filter.operator;

      if (filter.field === "start_time" || filter.field === "complete_time") {
        params[filter.field + key] = dayjs(filter.value).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        params[filter.field + key] = filter.value;
      }
    });

    return params;
  }, [queryOptions, paginationModel]);

  const { data, isLoading } = useQuery([url, { ...queryParams, ...query }], {
    enabled: queryEnabled,
  });

  const {
    count,
    results,
    lot_summary: lotSummary,
  } = data || { results: [], count: 0 };

  useEffect(() => {
    setTotal(count);
  }, [count]);

  const downloadExcel = () => {
    const endpoint =
      type === "lot"
        ? Endpoints.exportLotExcel
        : Endpoints.exportLotDataExcel(lotID);
    httpService
      .get(endpoint, {
        params: {
          ...queryParams,
          ...query,
        },
        responseType: "blob",
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const contentDispositionHeader =
          response.headers["content-disposition"];
        let filename = "";

        if (
          contentDispositionHeader &&
          contentDispositionHeader.indexOf("filename=") !== -1
        ) {
          const matches = contentDispositionHeader.match(/filename=([^;]+)/);
          if (matches && matches.length > 1) {
            filename = matches[1].replace(/"/g, ""); // Remove double quotes
          }
        }

        a.download = filename;
        a.click();

        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error);
      });
  };

  const optionalFields = [
    "wbt2",
    "dbt2",
    "rh",
    "mc5",
    "mc6",
    "mc7",
    "mc8",
    "wood_temp1",
    "wood_temp2",
  ];

  const columnsWithNewOperators = useMemo(() => {
    if (results && results.length) {
      return columns
        .filter((column) =>
          results.some(
            (item) =>
              !optionalFields.includes(column.field) ||
              (optionalFields.includes(column.field) &&
                !!item[column.field] &&
                item[column.field] !== -1)
          )
        )
        .map((column) => ({
          ...column,
          filterOperators: filterOpertorMap[column.type],
        }));
    }

    return columns;
  }, [columns, results]);

  const handleFilterChange = useCallback((filterModel, details) => {
    // Here you save the data you need from the filter model
    if (details?.reason) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
    setQueryOptions((prev) => ({ ...prev, filterModel: { ...filterModel } }));
  }, []);

  const customFilterIconButton = useCallback((props) => {
    const { counter, field, onClick } = props;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const apiRef = useGridApiContext();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rootProps = useGridRootProps();
    const ownerState = { ...props, classes: rootProps.classes };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classes = useUtilityClasses(ownerState);

    const column = apiRef.current.getColumn(field);
    if (!column.filterable) {
      return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleFilter = useCallback(
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { open, openedPanelValue } = gridPreferencePanelStateSelector(
          apiRef.current.state
        );

        if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
          apiRef.current.hideFilterPanel();
          setFilterButtonEl(null);
        } else {
          apiRef.current.showFilterPanel(field);
          setFilterButtonEl(apiRef.current.getColumnHeaderElement(field));
        }

        if (onClick) {
          onClick(apiRef.current.getColumnHeaderParams(field), event);
        }
      },
      [apiRef, field, onClick]
    );

    const iconButton = (
      <IconButton
        onClick={toggleFilter}
        sx={{ color: "white" }}
        aria-label={apiRef.current.getLocaleText("columnHeaderFiltersLabel")}
        size="small"
        tabIndex={-1}
      >
        <StyledBadge badgeContent={counter} color="secondary">
          <FilterAltOutlinedIcon className={classes.icon} fontSize="small" />
        </StyledBadge>
      </IconButton>
    );
    return <Box sx={{ display: "flex" }}>{iconButton}</Box>;
  }, []);

  const LotSummary = () => {
    const cardStyles = (theme) => ({
      pt: 2,
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    });

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          rowGap: 0,
          columnGap: 1,
          flexWrap: "wrap",
          "& > :not(style)": {
            mb: 2,
          },
        }}
      >
        <Card elevation={3} sx={cardStyles}>
          <CardContent>
            <Typography align="center" sx={{ fontSize: 14 }} gutterBottom>
              {t("totalQuantity")}
            </Typography>
            <Typography align="center" variant="h5">
              {lotSummary?.total_quantity?.toFixed(2) || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={3} sx={cardStyles}>
          <CardContent>
            <Typography align="center" sx={{ fontSize: 14 }} gutterBottom>
              {t("totalTimeInPeriod")}
            </Typography>
            <Typography align="center" variant="h5">
              <Duration durationInSeconds={lotSummary?.total_time_in_period} />
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={3} sx={cardStyles}>
          <CardContent>
            <Typography align="center" sx={{ fontSize: 14 }} gutterBottom>
              {t("totalOperationTime")}
            </Typography>
            <Typography align="center" variant="h5">
              <Duration durationInSeconds={lotSummary?.total_operation_time} />
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={3} sx={cardStyles}>
          <CardContent>
            <Typography align="center" sx={{ fontSize: 14 }} gutterBottom>
              {t("occupancyRatio")}
            </Typography>
            <Typography align="center" variant="h5">
              {lotSummary?.occupancy_ratio?.toFixed(2) || 0}%
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Button
          onClick={() => downloadExcel()}
          startIcon={<FileDownloadIcon />}
        >
          {t("export")}
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <>
      {type === "lot" && <LotSummary />}
      <Card
        elevation={3}
        sx={{
          "&.MuiCard-root": {
            borderRadius: 0,
          },
        }}
      >
        <DataGrid
          rows={results || []}
          rowCount={total}
          columns={columnsWithNewOperators}
          autoHeight={true}
          headerHeight={54}
          // rowSelection={false}
          disableRowSelectionOnClick
          density="compact"
          disableDensitySelector
          disableColumnSelector
          disableSelectionOnClick
          disableColumnMenu
          filterMode="server"
          loading={isLoading}
          pageSizeOptions={[10, 20, 25, 50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          slots={{
            toolbar: CustomToolbar,
            columnHeaderFilterIconButton: customFilterIconButton,
          }}
          onFilterModelChange={handleFilterChange}
          sx={{
            [`& .${gridClasses.columnHeader}:not(.${gridClasses["columnHeader--filtered"]}) .${gridClasses.filterIcon}`]:
              (theme) => ({
                opacity: 1,
                transition: theme.transitions.create(["opacity"], {
                  duration: theme.transitions.duration.shorter,
                }),
              }),
          }}
          slotProps={{
            panel: {
              anchorEl: filterButtonEl,
            },
            filterPanel: {
              // Force usage of "And" operator
              // Display columns by ascending alphabetical order

              columnsSort: "asc",
              filterFormProps: {
                // Customize inputs by passing props
                columnInputProps: {
                  size: "medium",
                  sx: { mt: "auto" },
                },
                operatorInputProps: {
                  size: "medium",
                  sx: { mt: "auto" },
                },
                valueInputProps: {
                  InputComponentProps: {
                    size: "medium",
                  },
                },
              },
              sx: {
                // Customize inputs using css selectors
                "& .MuiDataGrid-filterForm": { p: 2 },
                // "& .MuiDataGrid-filterForm:nth-of-type(even)": {
                //   backgroundColor: (theme) =>
                //     theme.palette.mode === "dark" ? "#444" : "#f5f5f5",
                // },
                "& .MuiDataGrid-filterFormLinkOperatorInput": { mr: 2 },
                "& .MuiDataGrid-filterFormColumnInput": {
                  mr: 2,
                  width: 150,
                  "& .Mui-disabled": {
                    "-webkit-text-fill-color": "black",
                  },
                  "& .MuiSvgIcon-root": {
                    display: "none",
                  },
                },
                "& .MuiDataGrid-filterFormOperatorInput": { mr: 2 },
                "& .MuiDataGrid-filterFormValueInput": { width: 200 },
              },
            },
          }}
        />
      </Card>
    </>
  );
};

export default Table;
