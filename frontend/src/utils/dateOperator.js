import * as React from "react";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

export const GridFilterDateInput = (props) => {
  const { item, applyValue, apiRef } = props;

  const Component = DatePicker;

  const handleFilterChange = (newValue) => {
    applyValue({ ...item, value: newValue?.format() });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Component
        inputFormat="DD/MM/YYYY"
        disableFuture
        value={item.value ? dayjs(item.value) : null}
        sx={{
          marginTop: "auto",
        }}
        renderInput={(params) => {
          return (
            <TextField
              value={params.inputProps?.value}
              {...params}
              variant="outlined"
              size="medium"
              label={apiRef.current.getLocaleText("filterPanelInputLabel")}
            />
          );
        }}
        InputAdornmentProps={{
          sx: {
            "& .MuiButtonBase-root": {
              marginRight: -1,
            },
          },
        }}
        onChange={handleFilterChange}
      />
    </LocalizationProvider>
  );
};
