import prisma from "../prisma/client.js";

export const upsertGoogleUser = async ({ email, name, profile_picture }) => {
  return prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      profile_picture,
    },
    create: {
      email,
      name,
      profile_picture,
    },
  });
};
