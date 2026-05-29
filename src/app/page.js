"use client";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import IndoorMap from "./components/IndoorMap";

export default function Home() {
  const [currentLog, setCurrentLog] = useState(null);
  const [history, setHistory] = useState([]);
  const [mockDuration, setMockDuration] = useState("Entering");

  useEffect(() => {
    const fetchInitialLogs = async () => {
      const { data } = await supabase
        .from("student_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (data && data.length > 0) {
        setCurrentLog(data[0]);
        setHistory(data);
      }
    };
    fetchInitialLogs();

    const channel = supabase
      .channel("realtime-tracking")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "student_logs" },
        (payload) => {
          const newLog = payload.new;
          setCurrentLog(newLog);
          setHistory((prev) => [newLog, ...prev.slice(0, 5)]);

          const durations = ["45min", "30min", "1hr", "15min", "3min"];
          setMockDuration(
            durations[Math.floor(Math.random() * durations.length)],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="w-96 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-blue-500 mb-1">
            RFID INSIGHT
          </h1>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>{" "}
            Live Tracking Connection
          </p>

          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Vị trí hiện tại
            </h2>
            {currentLog ? (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
                <p className="font-extrabold text-white text-xl mb-1">
                  {currentLog.student_name}
                </p>
                <p className="text-sm text-blue-400">
                  Khu vực:{" "}
                  <span className="font-bold text-white">
                    {currentLog.zone}
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Cập nhật:{" "}
                  {new Date(currentLog.created_at).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Đang chờ kết nối từ thẻ RFID...
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Mốc thời gian gần nhất (Timestamp)
            </h2>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {history.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-900/50 border border-slate-800/60 rounded-lg text-xs flex justify-between items-center hover:bg-slate-900 transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-200">
                      {log.student_name}
                    </span>
                    <span className="text-slate-400 mx-1.5">➜</span>
                    <span className="text-blue-400 font-medium">
                      {log.zone}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-600 border-t border-slate-800/80 pt-4">
          Enterprise RFID Tracking System • MVP Production
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
        <div className="w-full max-w-[1920px] mb-4 flex justify-between items-end px-2">
          <div>
            <h2 className="text-xl font-bold text-white">Tracking</h2>
          </div>
          {currentLog && (
            <div className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg font-mono">
              Kích hoạt: {currentLog.zone} ({mockDuration})
            </div>
          )}
        </div>

        <div className="shadow-2xl rounded-xl border border-slate-800 overflow-hidden">
          <IndoorMap
            currentZone={currentLog?.zone}
            durationText={mockDuration}
          />
        </div>
      </div>
    </div>
  );
}
