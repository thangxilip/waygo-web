import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ExportToolBar from "examples/ExportToolBar";

import Box from "@mui/material/Box";
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
} from "@mui/x-data-grid";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import styled from "@emotion/styled";
import { filterOpertorMap } from "utils/helper";

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

const Table = ({ columns, url, queryParams = {}, queryEnabled = true }) => {
  const [filterButtonEl, setFilterButtonEl] = React.useState(null);

  const [queryOptions, setQueryOptions] = useState({});
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
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
      params[filter.field + key] = filter.value;
    });

    return params;
  }, [queryOptions, paginationModel]);

  const columnsWithNewOperators = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        filterOperators: filterOpertorMap[column.type],
      })),
    [columns]
  );

  const { data, isLoading } = useQuery([url, { ...queryParams, ...query }], {
    enabled: queryEnabled,
  });

  const { count, results } = data || { results: [], count: 0 };

  useEffect(() => {
    setTotal(count);
  }, [count]);

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

  return (
    <DataGrid
      rows={results || []}
      rowCount={total}
      columns={columnsWithNewOperators}
      autoHeight={true}
      headerHeight={54}
      disableSelectionOnClick
      disableColumnMenu
      filterMode="server"
      loading={isLoading}
      pageSizeOptions={[10, 25, 50, 100]}
      paginationModel={paginationModel}
      paginationMode="server"
      onPaginationModelChange={setPaginationModel}
      slots={{
        toolbar: ExportToolBar,
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
  );
};

export default Table;
