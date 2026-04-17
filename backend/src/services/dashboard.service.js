import prisma from "../prisma/client.js";

const minutesToHours = (minutes = 0) => Number((minutes / 60).toFixed(2));

const getTodayRange = () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  return {
    startOfToday,
    startOfTomorrow,
  };
};

export const getDashboardSummary = async () => {
  const { startOfToday, startOfTomorrow } = getTodayRange();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalStudy,
    todayStudy,
    weeklyStudy,
    topicCount,
    categoryCount,
    activeSessions,
  ] = await Promise.all([
    prisma.studySession.aggregate({
      _sum: {
        actual_minutes: true,
      },
    }),
    prisma.studySession.aggregate({
      _sum: {
        actual_minutes: true,
      },
      where: {
        start_time: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
    }),
    prisma.studySession.aggregate({
      _sum: {
        actual_minutes: true,
      },
      where: {
        start_time: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prisma.topic.count(),
    prisma.category.count(),
    prisma.studySession.count({
      where: {
        end_time: null,
      },
    }),
  ]);

  return {
    total_study_hours: minutesToHours(totalStudy._sum.actual_minutes),
    today_hours: minutesToHours(todayStudy._sum.actual_minutes),
    weekly_hours: minutesToHours(weeklyStudy._sum.actual_minutes),
    topic_count: topicCount,
    category_count: categoryCount,
    active_sessions: activeSessions,
  };
};
