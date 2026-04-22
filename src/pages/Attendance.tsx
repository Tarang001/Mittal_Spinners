import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { WorkersAPI, AttendanceAPI } from "@/services/api";

interface Worker { id: string; name: string; role: string; }
interface AttendanceRecord {
  id: string;
  workerName: string;
  date: string;
  status: "PRESENT" | "ABSENT";
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const Attendance = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [date, setDate] = useState(todayStr());
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate] = useState(todayStr());
  const [present, setPresent] = useState<Record<string, boolean>>({});
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await WorkersAPI.list();
        const list = r.data ?? [];
        setWorkers(list);
        const init: Record<string, boolean> = {};
        list.forEach((w: Worker) => (init[w.id] = true));
        setPresent(init);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load workers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (workers.length === 0) return;
    (async () => {
      try {
        const r = await AttendanceAPI.list({ date });
        const rows = Array.isArray(r.data) ? r.data : [];
        if (rows.length === 0) return;
        const next: Record<string, boolean> = {};
        workers.forEach((w) => {
          const matched = rows.find((row: any) => row.workerId === w.id);
          next[w.id] = matched ? matched.status === "PRESENT" : true;
        });
        setPresent(next);
      } catch {
        // Keep default state when attendance is not yet marked.
      }
    })();
  }, [date, workers]);

  useEffect(() => {
    (async () => {
      setRecordsLoading(true);
      try {
        const r = await AttendanceAPI.list({ from: fromDate, to: toDate });
        setRecords(Array.isArray(r.data) ? r.data : []);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load attendance records");
      } finally {
        setRecordsLoading(false);
      }
    })();
  }, [fromDate, toDate]);

  const toggle = (id: string) => setPresent((s) => ({ ...s, [id]: !s[id] }));

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const entries = workers.map((w) => ({ workerId: w.id, present: !!present[w.id] }));
      await AttendanceAPI.mark({ date, entries });
      toast.success(`Attendance saved for ${date}`);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to mark attendance";
      if (e?.response?.status === 409) toast.error("Attendance already marked for this date.");
      else toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(present).filter(Boolean).length;

  const onExport = async () => {
    setExporting(true);
    try {
      const response = await AttendanceAPI.export({ fromDate, toDate });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-${fromDate}-to-${toDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Attendance export downloaded");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to export attendance");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Operations</p>
          <h1 className="mt-1 text-3xl font-semibold">Attendance</h1>
        </div>
        <div className="flex items-end gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <Button onClick={onSubmit} disabled={submitting || workers.length === 0}>
            {submitting ? "Saving…" : "Mark Attendance"}
          </Button>
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {workers.length > 0 && <>Present: <span className="font-medium text-foreground">{presentCount}</span> / {workers.length}</>}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading workers…</div>
        ) : workers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No workers found. Add workers first.</div>
        ) : (
          <ul className="divide-y divide-border">
            {workers.map((w) => (
              <li key={w.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.role}</p>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!present[w.id]}
                    onChange={() => toggle(w.id)}
                    className="h-4 w-4 rounded border-input accent-[hsl(var(--accent))]"
                  />
                  <span className={present[w.id] ? "text-foreground" : "text-muted-foreground"}>
                    {present[w.id] ? "Present" : "Absent"}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-lg font-semibold">Attendance Records</h2>
          <div className="flex items-end gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">To</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <Button onClick={onExport} disabled={exporting || !fromDate || !toDate}>
              {exporting ? "Exporting..." : "Export Attendance"}
            </Button>
          </div>
        </div>

        {recordsLoading ? (
          <div className="py-6 text-sm text-muted-foreground">Loading attendance records...</div>
        ) : records.length === 0 ? (
          <div className="py-6 text-sm text-muted-foreground">No attendance records found for this date range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Worker</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-border/60">
                    <td className="py-2 pr-4">{new Date(record.date).toISOString().slice(0, 10)}</td>
                    <td className="py-2 pr-4">{record.workerName}</td>
                    <td className="py-2 pr-4">{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Attendance;
