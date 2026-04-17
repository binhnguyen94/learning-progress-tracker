import API from "./api";

const normalizeStudySession = (session) => ({
  id: session.id ?? session.session_id,
  topic_id: session.topic_id,
  planned_minutes: session.planned_minutes ?? session.duration_minutes ?? 0,
  actual_minutes: session.actual_minutes ?? session.duration_minutes ?? 0,
  start_time: session.start_time ?? null,
  end_time: session.end_time ?? null,
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

export const createStudySession = async (topic_id, planned_minutes, note) => {
  try {
    const response = await API.post("/study-sessions", {
      topic_id,
      planned_minutes,
      note,
    });

    return normalizeStudySession(response.data.data);
  } catch (error) {
    const response = await API.post("/sessions", {
      topic_id,
      planned_minutes,
      notes: note,
    });

    return normalizeStudySession({
      ...response.data.data,
      planned_minutes,
      notes: note,
    });
  }
};

export const startStudySession = async (session_id) => {
  try {
    const response = await API.post(`/study-sessions/${session_id}/start`);
    return normalizeStudySession(response.data.data);
  } catch (error) {
    const response = await API.post("/sessions/start", { session_id });
    return normalizeStudySession(response.data.data);
  }
};

export const endStudySession = async (session_id) => {
  try {
    const response = await API.post(`/study-sessions/${session_id}/end`);
    return normalizeStudySession(response.data.data);
  } catch (error) {
    const response = await API.post(`/sessions/${session_id}/end`);
    return normalizeStudySession(response.data.data);
  }
};

export const deleteStudySession = async (id) => {
  try {
    await API.delete(`/study-sessions/${id}`);
  } catch (error) {
    await API.delete(`/sessions/${id}`);
  }
};
