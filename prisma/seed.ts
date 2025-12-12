import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("🌱 Starting database seed...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@nextcancel.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin User",
      password: hashedAdminPassword,
      isAdmin: true,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Admin user created:", admin.email);

  const season = await prisma.season.upsert({
    where: { id: "season-1" },
    update: {},
    create: {
      id: "season-1",
      name: "Season 1 - 2025",
      startDate: new Date(),
      isActive: true,
    },
  });

  console.log("✅ Season created:", season.name);

  const frenchInfluencers = [
    {
      name: "Squeezie",
      description: "YouTuber et streamer français, l'un des plus populaires francophones",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Squeezie",
      socialLinks: { youtube: "@xsqueezie", twitter: "@xsqueezie" },
    },
    {
      name: "Cyprien",
      description: "YouTuber humoristique français, pionnier du YouTube français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cyprien",
      socialLinks: { youtube: "@MonsieurDream", twitter: "@MonsieurDream" },
    },
    {
      name: "Norman Thavaud",
      description: "YouTuber et réalisateur français connu pour ses vidéos humoristiques",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Norman",
      socialLinks: { youtube: "@NormanFaitDesVideos" },
    },
    {
      name: "Natoo",
      description: "YouTubeuse française spécialisée dans l'humour et le lifestyle",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Natoo",
      socialLinks: { youtube: "@NatooOfficiel", instagram: "@natoooff" },
    },
    {
      name: "EnjoyPhoenix",
      description: "Influenceuse beauté et lifestyle française",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=EnjoyPhoenix",
      socialLinks: { youtube: "@EnjoyPhoenix", instagram: "@enjoyphoenix" },
    },
    {
      name: "Tibo InShape",
      description: "YouTuber fitness et lifestyle français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=TiboInShape",
      socialLinks: { youtube: "@TiboInShape", instagram: "@tiboinshape" },
    },
    {
      name: "Michou",
      description: "YouTuber et streamer français spécialisé dans le gaming",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michou",
      socialLinks: { youtube: "@MichouYT", twitch: "michou" },
    },
    {
      name: "Inoxtag",
      description: "YouTuber et aventurier français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Inoxtag",
      socialLinks: { youtube: "@Inoxtag", instagram: "@inoxtag" },
    },
    {
      name: "Amixem",
      description: "YouTuber français spécialisé dans l'humour et les expériences",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amixem",
      socialLinks: { youtube: "@Amixem", twitter: "@FrAmixem" },
    },
    {
      name: "Léna Situations",
      description: "YouTubeuse et influenceuse mode française",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=LenaSituations",
      socialLinks: { youtube: "@LenaSituations", instagram: "@lenamahfouf" },
    },
    {
      name: "McFly et Carlito",
      description: "Duo d'humoristes YouTubers français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=McFlyCarlito",
      socialLinks: { youtube: "@mcflyetcarlito" },
    },
    {
      name: "Hugo Décrypte",
      description: "Journaliste YouTube français spécialisé dans l'actualité",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=HugoDecrypte",
      socialLinks: { youtube: "@HugoDecrypte", instagram: "@hugodecrypte" },
    },
    {
      name: "Aude GG",
      description: "YouTubeuse gaming française",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AudeGG",
      socialLinks: { youtube: "@AudeGG", twitch: "audegg" },
    },
    {
      name: "Domingo",
      description: "YouTuber français spécialisé dans la tech et le lifestyle",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Domingo",
      socialLinks: { youtube: "@Domingo" },
    },
    {
      name: "Lama Faché",
      description: "YouTuber français connu pour ses critiques et analyses",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=LamaFache",
      socialLinks: { youtube: "@LamaFache" },
    },
    {
      name: "Lebouseuh",
      description: "YouTuber et streamer gaming français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lebouseuh",
      socialLinks: { youtube: "@Lebouseuh", twitch: "lebouseuh" },
    },
    {
      name: "MisterV",
      description: "Rappeur et YouTuber français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MisterV",
      socialLinks: { youtube: "@MisterVmusic", instagram: "@mistervmusic" },
    },
    {
      name: "Sofyan",
      description: "YouTuber français spécialisé dans les vlogs et challenges",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofyan",
      socialLinks: { youtube: "@SofyanShow" },
    },
    {
      name: "Joyca",
      description: "YouTubeuse lifestyle et mode française",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joyca",
      socialLinks: { youtube: "@JoycaOfficiel", instagram: "@joyca" },
    },
    {
      name: "Seb la Frite",
      description: "YouTuber humoristique français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SebLaFrite",
      socialLinks: { youtube: "@SebLaFrite" },
    },
    {
      name: "Monsieur Poulpe",
      description: "YouTuber français spécialisé dans l'humour absurde",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MonsieurPoulpe",
      socialLinks: { youtube: "@MonsieurPoulpe" },
    },
    {
      name: "Jhon Rachid",
      description: "Humoriste et YouTuber français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=JhonRachid",
      socialLinks: { youtube: "@JhonRachid" },
    },
    {
      name: "Poisson Fécond",
      description: "YouTuber français spécialisé dans les vidéos engagées",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PoissonFecond",
      socialLinks: { youtube: "@PoissonFecond" },
    },
    {
      name: "FastGoodCuisine",
      description: "YouTuber culinaire français",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=FastGoodCuisine",
      socialLinks: { youtube: "@FastGoodCuisine" },
    },
    {
      name: "Le Roi des Rats",
      description: "YouTuber français spécialisé dans la critique cinématographique",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeRoiDesRats",
      socialLinks: { youtube: "@LeRoiDesRats" },
    },
  ];

  for (const influencer of frenchInfluencers) {
    await prisma.celebrity.upsert({
      where: { name: influencer.name },
      update: {},
      create: {
        name: influencer.name,
        description: influencer.description,
        imageUrl: influencer.imageUrl,
        socialLinks: influencer.socialLinks,
        category: "french-influencer",
        isActive: true,
        totalVotes: Math.floor(Math.random() * 100),
      },
    });
  }

  console.log(`✅ ${frenchInfluencers.length} French influencers created`);
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
