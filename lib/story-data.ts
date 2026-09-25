import fs from "node:fs";
import path from "node:path";

export type StorySlide = {
  title: string;
  paragraphs: string[];
};

export type StoryAct = {
  slug: string;
  title: string;
  heading: string;
  summary: string;
  slides: StorySlide[];
};

function normalizeText(value: string) {
  return value.replace(/\r/g, "").trim();
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSummary(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 160) return cleaned;
  return `${cleaned.slice(0, 157).trim()}...`;
}

function parseActs(rawStory: string): StoryAct[] {
  const blocks = normalizeText(rawStory)
    .split(/\n\s*---\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const acts: StoryAct[] = [];

  blocks.forEach((block) => {
    const lines = block.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const heading = lines[0] ?? "Untitled";
    const title = heading.replace(/^[A-Z\s]+:\s*/, "").trim();
    const slug = makeSlug(heading);
    const contentWithoutHeading = block.replace(
      new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      "",
    );

    const partBlocks = contentWithoutHeading
      .split(/(?=^PART\s+[A-Z0-9]+:)/m)
      .map((part) => part.trim())
      .filter(Boolean);

    const slides: StorySlide[] = [];

    if (partBlocks.length === 0) {
      const paragraphs = contentWithoutHeading
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
        .filter(Boolean);

      slides.push({
        title,
        paragraphs,
      });
    } else {
      partBlocks.forEach((part) => {
        const match = part.match(/^PART\s+[A-Z0-9]+:\s*(.+)$/m);
        const slideTitle = match ? match[1].trim() : title;
        const content = part
          .replace(/^PART\s+[A-Z0-9]+:\s*.+(?:\n|$)/m, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        const paragraphs = content
          .split(/\n{2,}/)
          .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
          .filter(Boolean);

        if (paragraphs.length > 0) {
          slides.push({ title: slideTitle, paragraphs });
        }
      });
    }

    const summaryParagraph = slides[0]?.paragraphs[0] ?? title;

    acts.push({
      slug,
      title,
      heading,
      summary: buildSummary(summaryParagraph),
      slides,
    });
  });

  return acts.filter((act) => act.slides.length > 0);
}

export function getStoryActs(): StoryAct[] {
  const candidatePaths = [
    path.join(process.cwd(), "story.txt"),
    path.join(process.cwd(), "STORY.txt"),
  ];

  const storyPath = candidatePaths.find((filePath) => fs.existsSync(filePath));

  if (!storyPath) {
    throw new Error("Story file not found. Expected story.txt or STORY.txt in the project root.");
  }

  const rawStory = fs.readFileSync(storyPath, "utf8");
  return parseActs(rawStory);
}
