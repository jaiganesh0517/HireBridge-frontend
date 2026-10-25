import { useEffect, useState, useCallback } from "react";
import api from "../api/axios"; // VERIFY: default export, same as in Jobs.jsx

export default function useSavedJobs(enabled) {
  const [savedIds, setSavedIds] = useState(new Set());

  // Load the saved job ids once, only for logged-in students
  useEffect(() => {
    if (!enabled) {
      setSavedIds(new Set());
      return;
    }
    let ignore = false;
    api.get("/api/saved-jobs/ids")
      .then((res) => {
        if (!ignore) setSavedIds(new Set(res.data));
      })
      .catch(console.log);
    return () => { ignore = true; };
  }, [enabled]);

  const toggleSave = useCallback(async (jobId) => {
    const wasSaved = savedIds.has(jobId);

    // 1. update the UI immediately
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(jobId);
      else next.add(jobId);
      return next;
    });

    // 2. tell the server; if it fails, undo step 1
    try {
      if (wasSaved) await api.delete(`/api/saved-jobs/${jobId}`);
      else await api.post(`/api/saved-jobs/${jobId}`);
    } catch (err) {
  console.log("Save failed:", err.response?.status, err.response?.data || err.message);
  setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.add(jobId);
        else next.delete(jobId);
        return next;
      });
    }
  }, [savedIds]);

  return { savedIds, toggleSave };
}