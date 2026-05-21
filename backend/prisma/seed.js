import { PrismaClient, TopicStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "seed.user@example.com" },
    update: {},
    create: {
      email: "seed.user@example.com",
      name: "Seed User",
      profile_picture: null,
    },
  });

  const programmingCategory = await prisma.category.upsert({
    where: { category_id: "11111111-1111-1111-1111-111111111111" },
    update: {
      category_name: "Programming",
      description: "Coding and software engineering",
      user_id: user.user_id,
    },
    create: {
      category_id: "11111111-1111-1111-1111-111111111111",
      user_id: user.user_id,
      category_name: "Programming",
      description: "Coding and software engineering",
    },
  });

  const businessCategory = await prisma.category.upsert({
    where: { category_id: "22222222-2222-2222-2222-222222222222" },
    update: {
      category_name: "Business Analysis",
      description: "Business process and strategy",
      user_id: user.user_id,
    },
    create: {
      category_id: "22222222-2222-2222-2222-222222222222",
      user_id: user.user_id,
      category_name: "Business Analysis",
      description: "Business process and strategy",
    },
  });

  const sqlTopic = await prisma.topic.upsert({
    where: { topic_id: "33333333-3333-3333-3333-333333333333" },
    update: {
      user_id: user.user_id,
      category_id: programmingCategory.category_id,
      topic_name: "SQL Basics",
      description: "Learn SQL foundations",
      start_date: new Date("2026-01-05T09:00:00.000Z"),
      status: TopicStatus.ACTIVE,
    },
    create: {
      topic_id: "33333333-3333-3333-3333-333333333333",
      user_id: user.user_id,
      category_id: programmingCategory.category_id,
      topic_name: "SQL Basics",
      description: "Learn SQL foundations",
      start_date: new Date("2026-01-05T09:00:00.000Z"),
      status: TopicStatus.ACTIVE,
    },
  });

  const bmcTopic = await prisma.topic.upsert({
    where: { topic_id: "44444444-4444-4444-4444-444444444444" },
    update: {
      user_id: user.user_id,
      category_id: businessCategory.category_id,
      topic_name: "Business Model Canvas",
      description: "Design and evaluate business models",
      start_date: new Date("2026-01-10T09:00:00.000Z"),
      status: TopicStatus.ACTIVE,
    },
    create: {
      topic_id: "44444444-4444-4444-4444-444444444444",
      user_id: user.user_id,
      category_id: businessCategory.category_id,
      topic_name: "Business Model Canvas",
      description: "Design and evaluate business models",
      start_date: new Date("2026-01-10T09:00:00.000Z"),
      status: TopicStatus.ACTIVE,
    },
  });

  await prisma.learningLog.upsert({
    where: { log_id: "55555555-5555-5555-5555-555555555555" },
    update: {
      user_id: user.user_id,
      topic_id: sqlTopic.topic_id,
      study_date: new Date("2026-01-15T12:00:00.000Z"),
      duration_minutes: 90,
      study_content: "Practiced joins and aggregate queries.",
    },
    create: {
      log_id: "55555555-5555-5555-5555-555555555555",
      user_id: user.user_id,
      topic_id: sqlTopic.topic_id,
      study_date: new Date("2026-01-15T12:00:00.000Z"),
      duration_minutes: 90,
      study_content: "Practiced joins and aggregate queries.",
    },
  });

  await prisma.learningLog.upsert({
    where: { log_id: "66666666-6666-6666-6666-666666666666" },
    update: {
      user_id: user.user_id,
      topic_id: bmcTopic.topic_id,
      study_date: new Date("2026-01-18T12:00:00.000Z"),
      duration_minutes: 60,
      study_content: "Documented value proposition and customer segments.",
    },
    create: {
      log_id: "66666666-6666-6666-6666-666666666666",
      user_id: user.user_id,
      topic_id: bmcTopic.topic_id,
      study_date: new Date("2026-01-18T12:00:00.000Z"),
      duration_minutes: 60,
      study_content: "Documented value proposition and customer segments.",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
