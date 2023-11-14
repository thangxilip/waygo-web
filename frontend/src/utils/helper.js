import { GridFilterInputValue } from "@mui/x-data-grid";
import { GridFilterDateInput } from "./dateOperator";
import i18n from 'configs/i18n';
import { ReportStatusCode } from "./constants";

export const removeAuthToken = () => {
  localStorage.clear();
};

export const getUser = () => {
  return {
    ...JSON.parse(localStorage.getItem("user") || "{}"),
  };
};

export const saveDarkModeToStorage = (value) => {
  localStorage.setItem("dark_mode", value);
}

export const getDarkModeFromStorage = () => {
  return localStorage.getItem('dark_mode') === 'true';
}

export const getChamberStatus = (code) => {
  if (code <= ReportStatusCode.ISSUE_OTHERS) {
    code = ReportStatusCode.ISSUE_OTHERS
  };

  switch (code) {
    case ReportStatusCode.IDLE:
      return i18n.t('idle');
    case ReportStatusCode.OPERATING:
      return i18n.t('operating');
    case ReportStatusCode.ISSUE_MODBUS_TCP:
      return i18n.t('issue_modbus_tcp');
    case ReportStatusCode.ISSUE_SENSOR_UNIT:
      return i18n.t('issue_sensor_unit');
    case ReportStatusCode.HALTED_CABINET_AUTO_SW:
      return i18n.t('halted_cabinet_auto_sw');
    case ReportStatusCode.ISSUE_EQUIPMENT_OVERLOAD:
      return i18n.t('issue_equipment_overload');
    case ReportStatusCode.ISSUE_OTHERS:
      return i18n.t('issue_others');
    default:
      return i18n.t('unknown');
  }
};

export const getChamberStatusClass = (code) => {
  if (code <= ReportStatusCode.ISSUE_OTHERS) {
    code = ReportStatusCode.ISSUE_OTHERS
  };

  switch (code) {
    case ReportStatusCode.IDLE:
      return 'info';
    case ReportStatusCode.OPERATING:
      return 'success';
    case ReportStatusCode.ISSUE_MODBUS_TCP:
    case ReportStatusCode.ISSUE_SENSOR_UNIT:
    case ReportStatusCode.ISSUE_EQUIPMENT_OVERLOAD:
    case ReportStatusCode.ISSUE_OTHERS:
      return 'error';
    case ReportStatusCode.HALTED_CABINET_AUTO_SW:
      return 'secondary';
    default:
      return 'default';
  }
};

export const secondsToDuration = (seconds, dd=i18n.t("days"), d=i18n.t("day")) => {
  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds %= 60 * 60 * 24;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  seconds = Math.floor(seconds);

  const formattedDays = days > 1 ? `${days} ${dd}` : days === 1 ? `${days} ${d}` : '';
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
