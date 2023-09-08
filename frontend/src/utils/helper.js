import { GridFilterInputValue } from "@mui/x-data-grid";
import { GridFilterDateInput } from "./dateOperator";

export const removeAuthToken = () => {
  localStorage.clear();
};

export const getUser = () => {
  return {
    ...JSON.parse(localStorage.getItem("user") || "{}"),
  };
};

export const getChamberStatus = (code) => {
  if (code === 0) return "Operating";
  else return "Idle";
};

const typeEqualsOperator = {
  label: "equals",
  value: "=",
  InputComponent: GridFilterInputValue,
};
const dateGreaterOperator = {
  label: "greater than",
  value: "__gt",
  InputComponent: GridFilterDateInput,
};
const dateGreaterEqualsOperator = {
  label: "greater than equals",
  value: "__gte",
  InputComponent: GridFilterDateInput,
};
const dateLessEqualsOperator = {
  label: "less than equals",
  value: "__lte",
  InputComponent: GridFilterDateInput,
};
const dateLessOperator = {
  label: "less than",
  value: "__lt",
  InputComponent: GridFilterDateInput,
};
export const filterOpertorMap = {
  string: [typeEqualsOperator],
  date: [
    dateGreaterEqualsOperator,
    dateGreaterOperator,
    dateLessEqualsOperator,
    dateLessOperator,
  ],
};
