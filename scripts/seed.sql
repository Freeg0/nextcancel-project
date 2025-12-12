-- Create Season
INSERT INTO "Season" (id, name, "startDate", "isActive", "createdAt", "updatedAt")
VALUES
  ('test-season-1', 'Season 1 - 2025', NOW(), true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create Admin User (password is 'admin123' hashed with bcrypt)
INSERT INTO "User" (id, email, name, password, "isAdmin", "emailVerified", "createdAt", "updatedAt")
VALUES
  ('admin-user-1', 'admin@nextcancel.com', 'Admin User', '$2a$10$rG9yT7rX8QKxvkFtXb3NTOqK9YhGZ5mKZ7Nj6VxL.P0h2K3mJ8yLu', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Create Test Celebrities
INSERT INTO "Celebrity" (id, name, category, description, "imageUrl", "isActive", "totalVotes", "createdAt", "updatedAt")
VALUES
  (
    'celeb-1',
    'Squeezie',
    'french-influencer',
    'YouTuber et streamer français populaire',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Squeezie',
    true,
    15,
    NOW(),
    NOW()
  ),
  (
    'celeb-2',
    'Cyprien',
    'french-influencer',
    'YouTuber humoristique français',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Cyprien',
    true,
    12,
    NOW(),
    NOW()
  ),
  (
    'celeb-3',
    'Norman',
    'french-influencer',
    'Créateur de contenu vidéo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Norman',
    true,
    8,
    NOW(),
    NOW()
  ),
  (
    'celeb-4',
    'Natoo',
    'french-influencer',
    'YouTubeuse lifestyle et humour',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Natoo',
    true,
    10,
    NOW(),
    NOW()
  ),
  (
    'celeb-5',
    'EnjoyPhoenix',
    'french-influencer',
    'Influenceuse beauté et lifestyle',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=EnjoyPhoenix',
    true,
    7,
    NOW(),
    NOW()
  ),
  (
    'celeb-6',
    'Tibo InShape',
    'french-influencer',
    'YouTuber fitness et lifestyle français',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=TiboInShape',
    true,
    9,
    NOW(),
    NOW()
  ),
  (
    'celeb-7',
    'Michou',
    'french-influencer',
    'YouTuber et streamer français spécialisé dans le gaming',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Michou',
    true,
    11,
    NOW(),
    NOW()
  ),
  (
    'celeb-8',
    'Inoxtag',
    'french-influencer',
    'YouTuber et aventurier français',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Inoxtag',
    true,
    13,
    NOW(),
    NOW()
  )
ON CONFLICT (name) DO NOTHING;

SELECT 'Seed data inserted successfully!' as message;
