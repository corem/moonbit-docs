import fs from "fs/promises";
import path from "path";
import { BASE } from "./const";
import * as remark from "./remark";
import * as shiki from "./shiki";

type Chapter = {
  chapter: string;
  lessons: Lesson[];
};

type Lesson = {
  chapter: string;
  lesson: string;
  lessonIndex: number;
  lessonsLength: number;
  markdown: string;
  code: string;
};

async function dirs(path: string) {
  return (await fs.readdir(path, { withFileTypes: true }))
    .filter((i) => i.isDirectory())
    .sort((a, b) => {
      const na = +a.name.slice(a.name.search(/\d+/), a.name.search("_"));
      const nb = +b.name.slice(b.name.search(/\d+/), b.name.search("_"));
      return na - nb;
    });
}

async function scanTour(): Promise<Chapter[]> {
  const chapterFolders = await dirs("tour");
  const chapters: Chapter[] = [];
  for (const c of chapterFolders) {
    const chapter = c.name.split("_").slice(1).join(" ");
    const ds = await dirs(path.join(c.parentPath, c.name));
    const lessons: Lesson[] = await Promise.all(
      ds.map(async (d, i, arr) => {
        const lesson = d.name.split("_").slice(1).join(" ");
        const mdPath = path.join(d.parentPath, d.name, "index.md");
        const mbtPath = path.join(d.parentPath, d.name, "index.mbt");
        const md = await fs.readFile(mdPath, "utf8");
        const mbt = await fs.readFile(mbtPath, "utf8");
        return {
          chapter,
          lesson,
          lessonIndex: i,
          lessonsLength: arr.length,
          markdown: remark.mdToHtml(md),
          code: shiki.renderMoonBitCode(mbt),
        };
      }),
    );
    chapters.push({ chapter, lessons });
  }
  return chapters;
}

function slug(lesson: Lesson): string {
  return `${lesson.chapter.replaceAll(" ", "-")}/${lesson.lesson.replaceAll(" ", "-")}`;
}

function generateTOC(chapters: Chapter[]): { markdown: string; code: string } {
  const lines: string[] = [];
  lines.push(`# Table of Contents`);
  for (const c of chapters) {
    lines.push(`## ${c.chapter}`);
    for (const l of c.lessons) {
      lines.push(`- [${l.lesson}](${BASE}/${slug(l)}/index.html)`);
    }
  }
  return {
    markdown: remark.mdToHtml(lines.join("\n")),
    code: shiki.renderMoonBitCode(`fn main {
  println("hello, world")
}`),
  };
}

generateTOC(await scanTour());

export { generateTOC, scanTour, slug };
