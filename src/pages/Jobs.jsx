import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/api/jobs").then((res) => setJobs(res.data)).catch(console.log);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Jobs</h2>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </div>
  );
}