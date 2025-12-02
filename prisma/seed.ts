import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const celebrities = [
  {
    firstName: "Timothée",
    lastName: "Chalamet",
    displayName: "Timothée Chalamet",
    birthDate: new Date("1995-12-27"),
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    bio: "American actor known for his roles in Call Me by Your Name, Dune, and Wonka.",
  },
  {
    firstName: "Zendaya",
    lastName: "Coleman",
    displayName: "Zendaya",
    birthDate: new Date("1996-09-01"),
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
    bio: "American actress and singer, known for Euphoria, Spider-Man, and Dune.",
  },
  {
    firstName: "Florence",
    lastName: "Pugh",
    displayName: "Florence Pugh",
    birthDate: new Date("1996-01-03"),
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    bio: "British actress known for Little Women, Midsommar, and Black Widow.",
  },
  {
    firstName: "Austin",
    lastName: "Butler",
    displayName: "Austin Butler",
    birthDate: new Date("1991-08-17"),
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    bio: "American actor known for his portrayal of Elvis Presley in Elvis.",
  },
  {
    firstName: "Anya",
    lastName: "Taylor-Joy",
    displayName: "Anya Taylor-Joy",
    birthDate: new Date("1996-04-16"),
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
    bio: "Actress known for The Queen's Gambit, The Menu, and Furiosa.",
  },
  {
    firstName: "Tom",
    lastName: "Holland",
    displayName: "Tom Holland",
    birthDate: new Date("1996-06-01"),
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
    bio: "British actor best known for playing Spider-Man in the MCU.",
  },
  {
    firstName: "Millie Bobby",
    lastName: "Brown",
    displayName: "Millie Bobby Brown",
    birthDate: new Date("2004-02-19"),
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    bio: "British actress and producer, known for Stranger Things and Enola Holmes.",
  },
  {
    firstName: "Jacob",
    lastName: "Elordi",
    displayName: "Jacob Elordi",
    birthDate: new Date("1997-06-26"),
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    bio: "Australian actor known for Euphoria and The Kissing Booth.",
  },
  {
    firstName: "Jenna",
    lastName: "Ortega",
    displayName: "Jenna Ortega",
    birthDate: new Date("2002-09-27"),
    imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop",
    bio: "American actress known for Wednesday, Scream, and X.",
  },
  {
    firstName: "Pedro",
    lastName: "Pascal",
    displayName: "Pedro Pascal",
    birthDate: new Date("1975-04-02"),
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop",
    bio: "Chilean-American actor known for The Mandalorian, The Last of Us, and Game of Thrones.",
  },
  {
    firstName: "Sydney",
    lastName: "Sweeney",
    displayName: "Sydney Sweeney",
    birthDate: new Date("1997-09-12"),
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop",
    bio: "American actress known for Euphoria, The White Lotus, and Anyone But You.",
  },
  {
    firstName: "Paul",
    lastName: "Mescal",
    displayName: "Paul Mescal",
    birthDate: new Date("1996-02-02"),
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop",
    bio: "Irish actor known for Normal People, Aftersun, and Gladiator II.",
  },
];

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await prisma.vote.deleteMany();
  await prisma.celebrity.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // Create celebrities
  for (const celebrity of celebrities) {
    await prisma.celebrity.create({
      data: celebrity,
    });
  }

  console.log(`Created ${celebrities.length} celebrities`);

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
