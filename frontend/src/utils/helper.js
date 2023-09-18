import { GridFilterInputValue } from "@mui/x-data-grid";
import { GridFilterDateInput } from "./dateOperator";
import i18n from 'configs/i18n';

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

export const secondsToDuration = (seconds, d=i18n.t("days")) => {
  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds %= 60 * 60 * 24;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  seconds = Math.floor(seconds);

  const formattedDays = days > 0 ? `${days} ${d}` : '';
  const formattedHours = `${hours}`.padStart(2, '0');
  const formattedMinutes = `${minutes}`.padStart(2, '0');
  const formattedSeconds = `${seconds}`.padStart(2, '0');

  const timePart = [formattedHours, formattedMinutes, formattedSeconds].join(':');
  const parts = [formattedDays, timePart].filter(Boolean);

  return parts.join(' ');
}

export const langToLocale = (language) => {
  if (language === 'vi') {
    return 'viVN';
  }
  if (language === 'en') {
    return 'enUS'
  }
  return language;
}

const typeEqualsOperator = {
  label: i18n.t("equals"),
  value: "=",
  InputComponent: GridFilterInputValue,
};
const dateGreaterOperator = {
  label: i18n.t("greaterThan"),
  value: "__gt",
  InputComponent: GridFilterDateInput,
};
const dateGreaterEqualsOperator = {
  label: i18n.t("greaterThanEquals"),
  value: "__gte",
  InputComponent: GridFilterDateInput,
};
const dateLessEqualsOperator = {
  label: i18n.t("lessThanEquals"),
  value: "__lte",
  InputComponent: GridFilterDateInput,
};
const dateLessOperator = {
  label: i18n.t("lessThan"),
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
