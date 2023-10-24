export class ReportStatusCode {
  static IDLE = 0;
  static OPERATING = 1;
  static ISSUE_MODBUS_TCP = -1;
  static ISSUE_SENSOR_UNIT = -2;
  static HALTED_CABINET_AUTO_SW = -3;
  static ISSUE_EQUIPMENT_OVERLOAD = -4;
  static ISSUE_OTHERS = -5;
}
