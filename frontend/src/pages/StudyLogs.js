import { useEffect, useState } from "react";

import { getTopics } from "../services/topicService";
import {
  createStudySession,
  deleteStudySession,
  endStudySession,
  getStudySessions,
  startStudySession,
} from "../services/studySessionService";

const StudyLogs = () => {
  const [topics, setTopics] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [topicId, setTopicId] = useState("");
  const [plannedMinutes, setPlannedMinutes] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const calculateProgress = (planned, actual) => {
    if (!actual) {
      return 0;
    }

    return Math.round((actual / planned) * 100);
  };

  const fetchData = async () => {
    try {
      const [topicData, sessionData] = await Promise.all([
        getTopics(),
        getStudySessions(),
      ]);

      setTopics(topicData);

      const sessionsWithTopic = sessionData.map((session) => {
        if (session.topic?.name) {
          return session;
        }

        const matchedTopic = topicData.find(
          (topic) => String(topic.id) === String(session.topic_id),
        );

        return {
          ...session,
          topic: matchedTopic
            ? { id: matchedTopic.id, name: matchedTopic.name }
            : { id: session.topic_id, name: "Unknown Topic" },
        };
      });

      setSessions(sessionsWithTopic);
      setError("");
    } catch (error) {
      console.error("Study session error:", error);
      setError("Failed to load study sessions");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const plannedValue = Number(plannedMinutes);
    if (!topicId || !Number.isFinite(plannedValue) || plannedValue <= 0) {
      return;
    }

    try {
      await createStudySession(topicId, plannedValue, note.trim());
      setPlannedMinutes("");
      setNote("");
      await fetchData();
    } catch (error) {
      console.error("Study session error:", error);
      setError("Failed to load study sessions");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudySession(id);
      await fetchData();
    } catch (error) {
      console.error("Study session error:", error);
      setError("Failed to load study sessions");
    }
  };

  const handleStart = async (id) => {
    try {
      await startStudySession(id);
      await fetchData();
    } catch (error) {
      console.error("Study session error:", error);
      setError("Failed to load study sessions");
    }
  };

  const handleEnd = async (id) => {
    try {
      await endStudySession(id);
      await fetchData();
    } catch (error) {
      console.error("Study session error:", error);
      setError("Failed to load study sessions");
    }
  };

  return (
    <section className="study-logs-page">
      <div className="page-header">
        <h1>Study Logs</h1>
      </div>

      <form className="study-logs-form" onSubmit={handleSubmit}>
        <select value={topicId} onChange={(event) => setTopicId(event.target.value)}>
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={plannedMinutes}
          onChange={(event) => setPlannedMinutes(event.target.value)}
          placeholder="Enter planned minutes"
        />

        <input
          type="text"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Enter study note"
        />

        <button type="submit">Add Study Log</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <div className="study-logs-headings">
        <span>Topic</span>
        <span>Planned</span>
        <span>Actual</span>
        <span>Progress</span>
        <span>Actions</span>
      </div>

      <ul className="study-logs-list">
        {sessions.map((session) => (
          <li key={session.id} className="study-log-item">
            <span>{session.topic?.name}</span>
            <span>{session.planned_minutes} min</span>
            <span>{session.actual_minutes || 0} min</span>
            <span>
              {calculateProgress(session.planned_minutes, session.actual_minutes)}%
            </span>
            <div className="study-log-actions">
              {!session.start_time && (
                <button type="button" onClick={() => handleStart(session.id)}>
                  Start
                </button>
              )}
              {session.start_time && !session.end_time && (
                <button type="button" onClick={() => handleEnd(session.id)}>
                  End
                </button>
              )}
              {session.end_time && <span className="study-completed">Completed</span>}
              <button type="button" onClick={() => handleDelete(session.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StudyLogs;
