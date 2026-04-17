import { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCard";
import { getDashboardSummary } from "../services/dashboardService";

const initialSummary = {
  total_study_hours: 0,
  today_hours: 0,
  weekly_hours: 0,
  topic_count: 0,
  category_count: 0,
};

const Dashboard = () => {
  const [summary, setSummary] = useState(initialSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError("Unable to load dashboard summary.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (isLoading) {
    return <p className="status-text">Loading dashboard...</p>;
  }

  return (
    <section>
      <div className="page-header">
        <h1>Learning Dashboard</h1>
        <p>Track your study progress and learning activity.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="dashboard-grid">
        <DashboardCard
          title="Total Study Hours"
          value={summary.total_study_hours}
        />
        <DashboardCard title="Today Hours" value={summary.today_hours} />
        <DashboardCard title="Weekly Hours" value={summary.weekly_hours} />
        <DashboardCard title="Topic Count" value={summary.topic_count} />
        <DashboardCard title="Category Count" value={summary.category_count} />
      </div>
    </section>
  );
};

export default Dashboard;
