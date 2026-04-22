import * as attendanceService from "../services/attendanceService.js";
import { sendSuccess } from "../utils/response.js";

export async function mark(req, res, next) {
  try {
    const { date, entries } = req.body || {};
    await attendanceService.markAttendance({
      date,
      entries,
      markedBy: String(req.user?.sub || "system"),
    });
    return sendSuccess(res, true, 201);
  } catch (error) {
    return next(error);
  }
}

export async function list(req, res, next) {
  try {
    const data = await attendanceService.listAttendance(req.query || {});
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function exportWorkbook(req, res, next) {
  try {
    const { fromDate, toDate } = req.query;
    const workbook = await attendanceService.buildAttendanceWorkbook(String(fromDate), String(toDate));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendance-${String(fromDate)}-to-${String(toDate)}.xlsx"`
    );
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    return next(error);
  }
}
