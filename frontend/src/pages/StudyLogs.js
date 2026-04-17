import { useEffect, useState } from "react";

import { getTopics } from "../services/topicService";
import {
  createStudySession,
  deleteStudySession,
  getStudySessions,
} from "../services/studySessionService";

const StudyLogs = () => {
  const [topics, setTopics] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [topicId, setTopicId] = useState("");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

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

    const durationValue = Number(duration);
    if (!topicId || !Number.isFinite(durationValue) || durationValue <= 0) {
      return;
    }

    try {
      await createStudySession(topicId, durationValue, note.trim());
      setDuration("");
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
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          placeholder="Enter duration (minutes)"
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

      <ul className="study-logs-list">
        {sessions.map((session) => (
          <li key={session.id} className="study-log-item">
            <span>{session.topic?.name}</span>
            <span>{session.duration_minutes} min</span>
            <span>{session.note || "-"}</span>
            <button type="button" onClick={() => handleDelete(session.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StudyLogs;
