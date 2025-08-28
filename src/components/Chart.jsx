import { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import useSheetData from "../hooks/useSheetData";
import Dropdown from "./Dropdown";
import { useCategorize } from "../hooks/useCategorize";
import "bootstrap/dist/css/bootstrap.min.css"; 

function toUTCDate(y, m, d) {
  return new Date(Date.UTC(y, m, d));
}

function parseSheetDate(value) {
  if (value instanceof Date && !isNaN(value)) {
    return toUTCDate(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate()
    );
  }
  if (typeof value === "number" && isFinite(value)) {
    const ms = Math.round((value - 25569) * 86400000);
    const d = new Date(ms);
    return toUTCDate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  if (typeof value === "string") {
    const s = value.trim();
    let m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (m) return toUTCDate(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) return toUTCDate(+m[3], +m[2] - 1, +m[1]);
    const p = new Date(s);
    if (!isNaN(p))
      return toUTCDate(p.getUTCFullYear(), p.getUTCMonth(), p.getUTCDate());
  }
  return null;
}

export default function Chart() {
  const { data, loading } = useSheetData();
  const [accountName, setAccData] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedErrorCategory, setSelectedErrorCategory] = useState("");

  const {
    results: aiResults,
    loading: aiLoading,
    categorizeBatch,
  } = useCategorize();

  const filterAccountNameData = data.dataByCols["Account Name"] || [];
  const uniqueAccountNameData = useMemo(
    () => [...new Set(filterAccountNameData)].filter(Boolean),
    [filterAccountNameData]
  );

  const filterDates = data.dataByCols["Date"] || [];
  const parsedDates = useMemo(
    () =>
      filterDates
        .filter(Boolean)
        .map(parseSheetDate)
        .filter((d) => d && !isNaN(d)),
    [filterDates]
  );

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const uniqueYears = useMemo(
    () =>
      [...new Set(parsedDates.map((d) => d.getUTCFullYear()))]
        .filter(Boolean)
        .sort((a, b) => a - b)
        .map(String),
    [parsedDates]
  );
  const uniqueMonths = useMemo(() => {
    const months0to11 = [...new Set(parsedDates.map((d) => d.getUTCMonth()))]
      .filter((m) => m >= 0)
      .sort((a, b) => a - b);
    return months0to11.map((m) => ({
      value: String(m + 1),
      label: monthNames[m],
    }));
  }, [parsedDates]);
  const uniqueDays = useMemo(
    () =>
      [...new Set(parsedDates.map((d) => d.getUTCDate()))]
        .filter(Boolean)
        .sort((a, b) => a - b)
        .map(String),
    [parsedDates]
  );

  const uniqueErrorCategories = useMemo(() => {
    if (!accountName) return [];
    const accIdx = data.headers.indexOf("Account Name");
    const catIdx = data.headers.indexOf("Error Categorization");
    const dateIdx = data.headers.indexOf("Date");
    if (accIdx === -1 || catIdx === -1 || dateIdx === -1) return [];

    return [
      ...new Set(
        data.rows
          .filter((r) => {
            if (r[accIdx] !== accountName) return false;
            const dateObj = parseSheetDate(r[dateIdx]);
            if (!dateObj) return false;

            const yearMatch =
              !selectedYear || dateObj.getUTCFullYear() === +selectedYear;
            const monthMatch =
              !selectedMonth || dateObj.getUTCMonth() + 1 === +selectedMonth;
            const dayMatch =
              !selectedDay || dateObj.getUTCDate() === +selectedDay;

            return yearMatch && monthMatch && dayMatch;
          })
          .map((r) => r[catIdx])
          .filter(Boolean)
      ),
    ];
  }, [data, accountName, selectedYear, selectedMonth, selectedDay]);

  const errorDescriptions = useMemo(() => {
    if (!selectedErrorCategory) return [];
    const accIdx = data.headers.indexOf("Account Name");
    const catIdx = data.headers.indexOf("Error Categorization");
    const dateIdx = data.headers.indexOf("Date");
    const descIdx = data.headers.indexOf("Error Description");

    if (accIdx === -1 || catIdx === -1 || dateIdx === -1 || descIdx === -1)
      return [];

    return data.rows
      .filter((r) => {
        if (r[accIdx] !== accountName) return false;
        if (r[catIdx] !== selectedErrorCategory) return false;
        const dateObj = parseSheetDate(r[dateIdx]);
        if (!dateObj) return false;

        const yearMatch =
          !selectedYear || dateObj.getUTCFullYear() === +selectedYear;
        const monthMatch =
          !selectedMonth || dateObj.getUTCMonth() + 1 === +selectedMonth;
        const dayMatch = !selectedDay || dateObj.getUTCDate() === +selectedDay;
        return yearMatch && monthMatch && dayMatch;
      })
      .map((r) => r[descIdx])
      .filter(Boolean);
  }, [
    data,
    accountName,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedErrorCategory,
  ]);

  useEffect(() => {
    if (!selectedErrorCategory) return;
    const descriptions = errorDescriptions;
    if (descriptions.length > 0) {
      categorizeBatch(descriptions);
    }
  }, [selectedErrorCategory]);

  const chartData = useMemo(() => {
    if (!data.headers.length || !data.rows.length || selectedErrorCategory)
      return [];

    const accIdx = data.headers.indexOf("Account Name");
    const catIdx = data.headers.indexOf("Error Categorization");
    const dateIdx = data.headers.indexOf("Date");
    if (accIdx === -1 || catIdx === -1 || dateIdx === -1) return [];

    const counts = {};
    for (const row of data.rows) {
      if (row[accIdx] !== accountName) continue;
      const dateObj = parseSheetDate(row[dateIdx]);
      if (!dateObj) continue;

      const yearMatch =
        !selectedYear || dateObj.getUTCFullYear() === +selectedYear;
      const monthMatch =
        !selectedMonth || dateObj.getUTCMonth() + 1 === +selectedMonth;
      const dayMatch = !selectedDay || dateObj.getUTCDate() === +selectedDay;
      if (!(yearMatch && monthMatch && dayMatch)) continue;

      const category = row[catIdx] || "Unknown";
      counts[category] = (counts[category] || 0) + 1;
    }

    return Object.entries(counts).map(([key, count]) => ({
      category: key,
      count,
    }));
  }, [
    data,
    accountName,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedErrorCategory,
  ]);

  const aiChartData = useMemo(() => {
    if (!aiResults.length) return [];
    const counts = {};
    aiResults.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(counts).map(([key, count]) => ({
      category: key,
      count,
    }));
  }, [aiResults]);

  if (loading) return <p>Loading chart...</p>;

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  return (
    <div className="container mt-4">
      {accountName ? (
        <h2 className="mb-4 text-center fw-bold">
          Error Distribution for — {accountName}
        </h2>
      ) : (
        <h2 className="mb-4 text-center fw-bold">Error Distribution</h2>
      )}

      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3 fw-semibold">Filters</h5>
        <div className="row g-3">
          <div className="col-md-2">
            <Dropdown
              uniqueAccountNames={uniqueAccountNameData}
              onSelect={(val) => {
                setAccData(val);
                setSelectedErrorCategory("");
              }}
              selected={accountName}
              name={"Account Name"}
            />
          </div>
          <div className="col-md-2">
            <Dropdown
              uniqueAccountNames={uniqueYears}
              onSelect={setSelectedYear}
              selected={selectedYear}
              name={"Year"}
            />
          </div>
          <div className="col-md-2">
            <Dropdown
              uniqueAccountNames={uniqueMonths.map((m) => m.label)}
              onSelect={(val) => {
                const found = uniqueMonths.find((m) => m.label === val);
                setSelectedMonth(found?.value || "");
              }}
              selected={
                uniqueMonths.find((m) => m.value === String(selectedMonth))
                  ?.label || ""
              }
              name={"Month"}
            />
          </div>
          <div className="col-md-2">
            <Dropdown
              uniqueAccountNames={uniqueDays}
              onSelect={setSelectedDay}
              selected={selectedDay}
              name={"Day"}
            />
          </div>
          <div className="col-md-4">
            <Dropdown
              uniqueAccountNames={uniqueErrorCategories}
              onSelect={setSelectedErrorCategory}
              selected={selectedErrorCategory}
              name={"Error Category"}
            />
          </div>
        </div>
      </div>

      {accountName && !selectedErrorCategory && chartData.length > 0 && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="fw-semibold mb-3">Bar Chart</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="fw-semibold mb-3">Pie Chart</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {accountName && selectedErrorCategory && (
        <div className="card shadow-sm p-3 mt-4">
          <h5 className="fw-semibold mb-3 text-center">Error Categorization</h5>
          {aiChartData.length > 0 && (
            <div className="row">
              <div className="col-md-6 mb-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aiChartData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="col-md-6 mb-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={aiChartData}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {aiChartData.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <hr />
          <div className="mt-3">
            <div className="alert alert-warning small" role="alert">
              <p className="mb-2 fw-semibold">
                ⚠ Disclaimer: Classification is generated by the AI model. Below
                are the raw error descriptions for reference:
              </p>

              {aiLoading && <p className="text-primary mb-0">Classifying...</p>}

              {!aiLoading && aiResults.length > 0 && (
                <ul className="list-group list-group-flush">
                  {aiResults.map((item, idx) => (
                    <li key={idx} className="list-group-item">
                      <strong>{item.category}</strong> — {item.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
