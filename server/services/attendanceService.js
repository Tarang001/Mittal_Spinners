import ExcelJS from "exceljs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/errors.js";
import { normalizeDateOnly, parseDateRange } from "../utils/date.js";

export async function markAttendance({ date, entries, markedBy }) {
  const day = normalizeDateOnly(date);

  try {
    await prisma.$transaction(
      entries.map((entry) =>
        prisma.attendance.create({
          data: {
            workerId: String(entry.workerId),
            date: day,
            status: entry.present ? "PRESENT" : "ABSENT",
            markedBy,
          },
        })
      )
    );
  } catch (error) {
    if (error?.code === "P2002") {
      throw new AppError("Attendance already exists for one or more workers.", 409);
    }
    throw error;
  }

  return true;
}

export async function listAttendance(query) {
  const dateQuery = query.date;
  const fromQuery = query.from;
  const toQuery = query.to;
  const where = {};

  if (dateQuery) {
    where.date = normalizeDateOnly(String(dateQuery));
  } else if (fromQuery || toQuery) {
    const range = {};
    if (fromQuery) range.gte = normalizeDateOnly(String(fromQuery));
    if (toQuery) {
      const toDate = normalizeDateOnly(String(toQuery));
      const endOfDay = new Date(toDate);
      endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
      range.lt = endOfDay;
    }
    where.date = range;
  }

  const rows = await prisma.attendance.findMany({
    where,
    include: { worker: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    workerId: row.workerId,
    workerName: row.worker.name,
    date: row.date,
    status: row.status,
    markedBy: row.markedBy,
  }));
}

export async function buildAttendanceWorkbook(fromDate, toDate) {
  const { fromDate: from, endExclusive } = parseDateRange(fromDate, toDate);

  const rows = await prisma.attendance.findMany({
    where: { date: { gte: from, lt: endExclusive } },
    include: { worker: true },
    orderBy: [{ date: "asc" }, { worker: { name: "asc" } }],
  });

  const dateKeys = [];
  const cursor = new Date(from);
  while (cursor < endExclusive) {
    dateKeys.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const byWorker = new Map();
  for (const row of rows) {
    const workerName = row.worker.name;
    const dateKey = new Date(row.date).toISOString().slice(0, 10);
    if (!byWorker.has(workerName)) byWorker.set(workerName, {});
    byWorker.get(workerName)[dateKey] = row.status === "PRESENT" ? "Present" : "Absent";
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Attendance");
  sheet.addRow(["Worker Name", ...dateKeys]);

  const workerNames = Array.from(byWorker.keys()).sort((a, b) => a.localeCompare(b));
  for (const workerName of workerNames) {
    const attendanceMap = byWorker.get(workerName);
    sheet.addRow([workerName, ...dateKeys.map((dateKey) => attendanceMap[dateKey] || "")]);
  }

  return workbook;
}
