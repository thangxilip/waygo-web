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

export const secondsToDuration = (seconds) => {
  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds %= 60 * 60 * 24;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const formattedDays = days > 0 ? `${days} days` : '';
  const formattedHours = `${hours}`.padStart(2, '0');
  const formattedMinutes = `${minutes}`.padStart(2, '0');
  const formattedSeconds = `${seconds}`.padStart(2, '0');

  const timePart = [formattedHours, formattedMinutes, formattedSeconds].join(':');
  const parts = [formattedDays, timePart].filter(Boolean);

  return parts.join(' ');
}

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
