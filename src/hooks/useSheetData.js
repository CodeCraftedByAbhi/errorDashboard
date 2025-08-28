import { useState, useEffect } from "react";

export default function useSheetData(refreshInterval = 30000) {
  const [data, setData] = useState({ headers: [], rows: [], dataByCols: {} });
  const [loading, setLoading] = useState(true);

  const SHEET_ID = "11Hyjnhc6krryGPj2bhSbhEEDPlK7FCot";
  const TAB_NAME = "Internal Errors";

  const formatDate = (y, m, d) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${y}-${pad(m)}-${pad(d)}`;
  };

  const parseCell = (c) => {
    if (!c) return "";

    if (typeof c.v === "string" && /^Date\(\d+,\d+,\d+\)/.test(c.v)) {
      const parts = c.v.match(/\d+/g).map(Number);
      return formatDate(parts[0], parts[1] + 1, parts[2]);
    }

    if (c.v instanceof Date) {
      return formatDate(c.v.getFullYear(), c.v.getMonth() + 1, c.v.getDate());
    }

    if (typeof c.v === "string" && !isNaN(Date.parse(c.v))) {
      const d = new Date(c.v);
      return formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    if (typeof c.v === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(c.v)) {
      const [day, month, year] = c.v.split("/").map(Number);
      return formatDate(year, month, day);
    }

    return c.v;
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${TAB_NAME}&tq=select%20*&tqx=out:json`
      );

      const text = await res.text();
      const json = JSON.parse(text.slice(47, -2));
      // console.log(json)

      const headers = json.table.cols.map((c) => c.label || "");
      const rows = json.table.rows.map((r) => r.c.map((c) => parseCell(c)));

      const dataByCols = headers.reduce((acc, header, i) => {
        acc[header] = rows.map((row) => row[i]);
        return acc;
      }, {});
      // console.log(dataByCols)

      setData({ headers, rows, dataByCols });
    } catch (err) {
      console.error("Error fetching sheet data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 

    const interval = setInterval(fetchData, refreshInterval); 
    return () => clearInterval(interval); 
  }, [SHEET_ID, TAB_NAME, refreshInterval]);

  return { data, loading };
}
