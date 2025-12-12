import { PrismaClient } from "@prisma/client";

// Create a simple client for seeding
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Adding test data via raw SQL...");

  try {
    // Create a season
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Season" (id, name, "startDate", "isActive", "createdAt", "updatedAt")
      VALUES ('test-season-1', 'Season 1 - 2025', NOW(), true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);
    console.log("✅ Season created");

    // Create an admin user (password is 'admin123' hashed)
    await prisma.$executeRawUnsafe(`
      INSERT INTO "User" (id, email, name, password, "isAdmin", "emailVerified", "createdAt", "updatedAt")
      VALUES (
        'admin-user-1',
        'admin@nextcancel.com',
        'Admin User',
        '$2a$10$rG9yT7rX8QKxvkFtXb3NTOqK9YhGZ5mKZ7Nj6VxL.P0h2K3mJ8yLu',
        true,
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO NOTHING
    `);
    console.log("✅ Admin user created");

    // Create test celebrities
    const celebrities = [
      ['celeb-1', 'Squeezie', 'YouTuber et streamer français populaire', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Squeezie', 15],
      ['celeb-2', 'Cyprien', 'YouTuber humoristique français', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cyprien', 12],
      ['celeb-3', 'Norman', 'Créateur de contenu vidéo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Norman', 8],
      ['celeb-4', 'Natoo', 'YouTubeuse lifestyle et humour', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natoo', 10],
      ['celeb-5', 'EnjoyPhoenix', 'Influenceuse beauté et lifestyle', 'https://api.dicebear.com/7.x/avataaars/svg?seed=EnjoyPhoenix', 7],
      ['celeb-6', 'Tibo InShape', 'YouTuber fitness et lifestyle', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TiboInShape', 9],
      ['celeb-7', 'Michou', 'YouTuber et streamer gaming', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michou', 11],
      ['celeb-8', 'Inoxtag', 'YouTuber et aventurier français', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Inoxtag', 13],
    ];

    for (const [id, name, desc, img, votes] of celebrities) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "Celebrity" (id, name, category, description, "imageUrl", "isActive", "totalVotes", "createdAt", "updatedAt")
        VALUES (
          '${id}',
          '${name}',
          'french-influencer',
          '${desc}',
          '${img}',
          true,
          ${votes},
          NOW(),
          NOW()
        )
        ON CONFLICT (name) DO NOTHING
      `);
    }

    console.log(`✅ ${celebrities.length} celebrities created`);
    console.log("🎉 Test data added successfully!");
    console.log("\n📝 Login credentials:");
    console.log("   Email: admin@nextcancel.com");
    console.log("   Password: admin123");
  } catch (error) {
    console.error("Error details:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error adding test data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
