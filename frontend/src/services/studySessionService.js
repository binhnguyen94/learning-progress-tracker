import API from "./api";

const normalizeStudySession = (session) => ({
  id: session.id ?? session.session_id,
  topic_id: session.topic_id,
  duration_minutes: session.duration_minutes ?? 0,
  note: session.note ?? session.notes ?? "",
  topic: session.topic
    ? {
        id: session.topic.id ?? session.topic.topic_id,
        name: session.topic.name ?? session.topic.topic_name,
      }
    : null,
});

export const getStudySessions = async () => {
  try {
    const response = await API.get("/study-sessions");
    return response.data.data.map(normalizeStudySession);
  } catch (error) {
    const response = await API.get("/sessions");
    return response.data.data.map(normalizeStudySession);
  }
};

export const createStudySession = async (topic_id, duration_minutes, note) => {
  try {
    const response = await API.post("/study-sessions", {
      topic_id,
      duration_minutes,
      note,
    });

    return normalizeStudySession(response.data.data);
  } catch (error) {
    const response = await API.post("/sessions/start", {
      topic_id,
      notes: note,
    });

    return normalizeStudySession({
      ...response.data.data,
      duration_minutes,
      notes: note,
    });
  }
};

export const deleteStudySession = async (id) => {
  try {
    await API.delete(`/study-sessions/${id}`);
  } catch (error) {
    await API.delete(`/sessions/${id}`);
  }
};
