import { Comic, Chapter } from "./types";
import { comic1ChapterPages } from "./chapters/comic1";
import { comic2ChapterPages } from "./chapters/comic2";
import { comic3ChapterPages } from "./chapters/comic3";
import { comic4ChapterPages } from "./chapters/comic4";
import { comic5ChapterPages } from "./chapters/comic5";
import { comic6ChapterPages } from "./chapters/comic6";

export const mockComics: Comic[] = [
  {
    id: "1",
    title: "Solo Max-Level Newbie",
    author: "Hwabong",
    coverImage:
      "https://gg.asuracomic.net/storage/media/272496/conversions/01JMHFP0DBPD906JMCZNAKG1RH-thumb-small.webp",
    description:
      "In a world where dungeons and monsters have become reality, follow the journey of Sung Jin-Woo as he rises from the weakest hunter to become the Shadow Monarch.",
    genres: ["Action", "Fantasy", "Adventure"],
    rating: 4.9,
    status: "ongoing",
    totalChapters: 7,
  },
  {
    id: "2",
    title: "Absolute Regression",
    author: "Jang Young-hoon",
    coverImage:
      "https://images-ext-1.discordapp.net/external/R5p1UzUcrGXBUQ-MpuWoDqo1J6wNGUOcrusnIAC7Ia4/https/gg.asuracomic.net/storage/media/285/conversions/01J4J7N5E8J6GSEYWGV23ZFHDG-optimized.webp?format=webp&width=663&height=960",
    description:
      "What would you do if you were given a chance to climb the Tower and have any wish granted? Follow Bam as he climbs the mysterious tower searching for his friend.",
    genres: ["Fantasy", "Mystery", "Action"],
    rating: 4.8,
    status: "ongoing",
    totalChapters: 7,
  },
  {
    id: "3",
    title: "Regressor Instruction Manual",
    author: "Park Seo-Jun",
    coverImage:
      "https://gg.asuracomic.net/storage/media/316680/conversions/01JWCZWMSHZA9GC005W65PMXGY-thumb-small.webp",
    description:
      "Betrayed by his companions and left for dead, the disaster-class hero returns after 20 years seeking revenge against those who wronged him.",
    genres: ["Action", "Drama", "Revenge"],
    rating: 4.7,
    status: "ongoing",
    totalChapters: 7,
  },
  {
    id: "4",
    title: "Overgeared.",
    author: "Choi Yeon-Woo",
    coverImage:
      "https://gg.asuracomic.net/storage/media/317437/conversions/01JWNCVM71RJRGNWA31D1AN4P4-thumb-small.webp",
    description:
      "When dungeons appeared, humanity awakened to supernatural powers. But one man discovers a unique ability that lets him level up infinitely.",
    genres: ["Action", "Fantasy", "Adventure"],
    rating: 4.6,
    status: "ongoing",
    totalChapters: 7,
  },
  {
    id: "5",
    title: "Trash of the count Family",
    author: "Kim Sung-Min",
    coverImage:
      "https://gg.asuracomic.net/storage/media/267105/conversions/01JJNC19KJPFJVV6S6HJ6A1BZD-thumb-small.webp",
    description:
      "A king reincarnated into a magical world seeks to correct his past mistakes and protect those he loves in his second life.",
    genres: ["Fantasy", "Romance", "Adventure"],
    rating: 4.9,
    status: "ongoing",
    totalChapters: 7,
  },
  {
    id: "6",
    title: "Revenge of the Iron-Blooded Swordhound",
    author: "Jung Hae-In",
    coverImage:
      "https://gg.asuracomic.net/storage/media/298/conversions/01J7TV2G7719CVSTSW9T9M6F31-thumb-small.webp",
    description:
      "The sole reader of a web novel finds himself living in the story's world. With his knowledge of all future events, can he survive and change the ending?",
    genres: ["Fantasy", "Action", "Thriller"],
    rating: 4.8,
    status: "ongoing",
    totalChapters: 7,
  },
];

// Generate chapters for a comic
export const getChaptersForComic = (
  comicId: string,
): Chapter[] => {
  const comic = mockComics.find((c) => c.id === comicId);
  if (!comic) return [];

  const chapters: Chapter[] = [];
  const now = new Date();

  // Generate exactly 7 chapters for each comic
  for (let i = 1; i <= 7; i++) {
    let releaseDate: Date;
    let premiumReleaseDate: Date;
    let isLocked: boolean;

    if (i <= 6) {
      // Chapters 1-6: Already released for everyone
      const daysAgo = 6 - i; // Chapter 1 is 5 days ago, Chapter 6 is 0 days ago (today)
      releaseDate = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000,
      );
      premiumReleaseDate = new Date(
        releaseDate.getTime() - 7 * 24 * 60 * 60 * 1000,
      );
      isLocked = false; // Free for everyone
    } else {
      // Chapter 7: Premium early access (releases in 7 days for free users)

      // Premium users can read now
      premiumReleaseDate = new Date(now.getTime());

      // Free users must wait 7 days
      releaseDate = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000,
      );

      isLocked = true; // Locked for free users
    }

    chapters.push({
      id: `${comicId}-${i}`,
      comicId,
      number: i,
      title: `Chapter ${i}: ${generateChapterTitle(i)}`,
      releaseDate,
      premiumReleaseDate,
      isLocked,
      pages: generateMockPages(i, comicId),
    });
  }

  return chapters;
};

const generateChapterTitle = (chapterNum: number): string => {
  const titles = [
    "The Awakening",
    "New Powers",
    "First Battle",
    "Hidden Truth",
    "The Betrayal",
    "Rising Conflict",
    "Breaking Point",
    "Revelation",
    "The Final Stand",
    "New Beginning",
  ];
  return titles[chapterNum % titles.length];
};

const generateMockPages = (
  chapterNum: number,
  comicId: string,
): string[] => {
  // Get the appropriate page images based on comic ID
  let pageImages: string[];

  switch (comicId) {
    case "1":
      pageImages = comic1ChapterPages;
      break;
    case "2":
      pageImages = comic2ChapterPages;
      break;
    case "3":
      pageImages = comic3ChapterPages;
      break;
    case "4":
      pageImages = comic4ChapterPages;
      break;
    case "5":
      pageImages = comic5ChapterPages;
      break;
    case "6":
      pageImages = comic6ChapterPages;
      break;
    default:
      pageImages = comic1ChapterPages;
  }

  // Return 3-5 random pages per chapter
  const numPages = 3 + (chapterNum % 3);
  return Array(numPages)
    .fill(0)
    .map(
      (_, i) =>
        pageImages[(chapterNum + i) % pageImages.length],
    );
};