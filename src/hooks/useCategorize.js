import { useState, useCallback } from "react";

export const useCategorize = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const categorizeBatch = useCallback(async (descriptions) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descriptions }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Categorization failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, categorizeBatch };
};
