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

  const [totalStudy, todayStudy, weeklyStudy, topicCount, categoryCount] =
    await Promise.all([
      prisma.learningLog.aggregate({
        _sum: {
          duration_minutes: true,
        },
      }),
      prisma.learningLog.aggregate({
        _sum: {
          duration_minutes: true,
        },
        where: {
          study_date: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
        },
      }),
      prisma.learningLog.aggregate({
        _sum: {
          duration_minutes: true,
        },
        where: {
          study_date: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.topic.count(),
      prisma.category.count(),
    ]);

  return {
    total_study_hours: minutesToHours(totalStudy._sum.duration_minutes),
    today_hours: minutesToHours(todayStudy._sum.duration_minutes),
    weekly_hours: minutesToHours(weeklyStudy._sum.duration_minutes),
    topic_count: topicCount,
    category_count: categoryCount,
    // Session architecture has been removed; this metric is intentionally fixed.
    active_sessions: 0,
  };
};
