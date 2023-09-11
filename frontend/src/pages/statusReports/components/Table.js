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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import styled from "@emotion/styled";
import { filterOpertorMap } from "utils/helper";
import httpService from "utils/httpServices";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';


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

const Table = ({ columns, url, queryParams = {}, queryEnabled = true, pageSize = 20, type, lotID }) => {
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
      params[filter.field + key] = filter.value;
    });

    return params;
  }, [queryOptions, paginationModel]);

  const { data, isLoading } = useQuery([url, { ...queryParams, ...query }], {
    enabled: queryEnabled,
  });

  const { count, results, chamber_summary: chamberSummary } = data || { results: [], count: 0 };

  useEffect(() => {
    setTotal(count);
  }, [count]);

  const downloadExcel = () => {
    httpService
    .get(Endpoints.exportStatusReportExcel, {
      params: {
        ...queryParams,
        ...query,
      },
      responseType: 'blob',
    })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDispositionHeader = response.headers['content-disposition'];
      let filename = '';
      
      if (contentDispositionHeader && contentDispositionHeader.indexOf('filename=') !== -1) {
        const matches = contentDispositionHeader.match(/filename=([^;]+)/);
        if (matches && matches.length > 1) {
          filename = matches[1].replace(/"/g, ''); // Remove double quotes
        }
      }
      
      a.download = filename;
      a.click();

      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error downloading Excel file:', error);
    });
  }

  const statusFilterOperators = [
    {
      label: 'equals',
      value: "=",
      getApplyFilterFn: (filterItem) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }

        return (params) => {
          return Number(params.value) === Number(filterItem.value);
        };
      },
      InputComponent: ({ item, applyValue }) => (
        <Box>
          <InputLabel id="status-select-label">Value</InputLabel>
          <Select
            sx={{background: 'red'}}
            label="status-select"
            labelId="status-select-label"
            value={item.value}
            onChange={(e) => applyValue({ ...item, value: e.target.value })}
          >
            <MenuItem value={"0"}>Operating</MenuItem>
            <MenuItem value={1}>Idle</MenuItem>
          </Select>
        </Box>
      ),
    },
  ];

  const columnsWithNewOperators = useMemo(
    () =>
      columns
      .map((column) => column.field === 'status_code' ? { 
        ...column,
        filterOperators: statusFilterOperators,
       } : {
        ...column,
        filterOperators: filterOpertorMap[column.type],
      }),
    [columns]
  );

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

  const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
  }));

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay style={{margin: 20}}>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  const ChamberSummary = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        flexWrap: 'wrap',
        '& > :not(style)': {
          mb: 2,
        },
      }}
    >
       <Card elevation={3} sx={{pt: 2}}>
        <CardContent>
          <Typography align="center" sx={{ fontSize: 14 }} gutterBottom>
            Total Idle Chambers
          </Typography>
          <Typography align="center" variant="h5" color="info.main">
            {chamberSummary?.total_idle_chambers}
          </Typography>
        </CardContent>
      </Card>
      <Card elevation={3} sx={{pt: 2}}>
        <CardContent>
          <Typography align="center" sx={{ fontSize: 14 }} gutterBottom>
          Total Operating Chambers
          </Typography>
          <Typography align="center" variant="h5" color="success.main">
          {chamberSummary?.total_operating_chambers}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Button onClick={() => downloadExcel()} startIcon={<FileDownloadIcon/>}>Export</Button>
      </GridToolbarContainer>
    );
  }
 
  return (
    <>
    <ChamberSummary/>
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
        noRowsOverlay: CustomNoRowsOverlay,
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
        backgroundColor: '#ffffff',
        borderRadius: '4px', // Add slight rounded corners
        boxShadow: '0 3px 4px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
        '& .MuiDataGrid-colCellTitle': {
          fontWeight: 'bold', // Make column headers bold
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid #e0e0e0', // Add a bottom border to cells
          padding: '8px', // Add padding to cells,
        },
        '& .MuiDataGrid-footer': {
          borderTop: '1px solid #e0e0e0', // Add a top border to the footer
        },
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
    </>
  );
};

export default Table;
