import {
  seedAwards,
  seedExperiences,
  seedProjects,
  seedSections,
  seedSettings,
  seedSkills,
} from "./seed-data";
import type {
  Award,
  Experience,
  PortfolioData,
  Project,
  Section,
  Setting,
  Skill,
} from "./types";
import { sortBySort } from "./utils";

/** 未接 Supabase 或读取失败时的降级数据 */
export function fallbackData(): PortfolioData {
  return {
    sections: sortBySort(seedSections),
    projects: sortBySort(seedProjects),
    experiences: sortBySort(seedExperiences),
    skills: sortBySort(seedSkills),
    awards: sortBySort(seedAwards),
    settings: sortBySort(seedSettings),
  };
}

function visibleOnly<T extends { visible: boolean; sort: number }>(
  rows: T[] | null,
): T[] {
  return sortBySort((rows ?? []).filter((r) => r.visible !== false));
}

/**
 * 读取前台需要的全部数据。
 * 传入了 client 就查 Supabase，否则/失败时用降级数据。
 */
export async function loadPortfolioData(client: unknown): Promise<{
  data: PortfolioData;
  source: "supabase" | "fallback";
}> {
  if (!client) return { data: fallbackData(), source: "fallback" };

  try {
    const db = client as {
      from: (table: string) => {
        select: (cols: string) => {
          order: (
            col: string,
            opts: { ascending: boolean },
          ) => Promise<{ data: unknown[] | null; error: unknown }>;
        };
      };
    };

    const [sections, projects, experiences, skills, awards, settings] =
      await Promise.all(
        (
          ["sections", "projects", "experiences", "skills", "awards", "settings"] as const
        ).map((table) => db.from(table).select("*").order("sort", { ascending: true })),
      );

    const failed =
      sections.error ||
      projects.error ||
      experiences.error ||
      skills.error ||
      awards.error ||
      settings.error;
    if (failed) throw failed;

    return {
      source: "supabase",
      data: {
        sections: visibleOnly(sections.data as Section[]),
        projects: visibleOnly(projects.data as Project[]),
        experiences: visibleOnly(experiences.data as Experience[]),
        skills: visibleOnly(skills.data as Skill[]),
        awards: visibleOnly(awards.data as Award[]),
        settings: visibleOnly(settings.data as Setting[]),
      },
    };
  } catch (error) {
    console.warn("[portfolio] Supabase 读取失败，已降级到本地数据：", error);
    return { data: fallbackData(), source: "fallback" };
  }
}

export function findSection(data: PortfolioData, key: string): Section | undefined {
  return data.sections.find((s) => s.key === key);
}

export function findSetting(data: PortfolioData, key: string): Setting | undefined {
  return data.settings.find((s) => s.key === key);
}

export function groupSkills(skills: Skill[]): { category: string; items: Skill[] }[] {
  const map = new Map<string, Skill[]>();
  skills.forEach((skill) => {
    const list = map.get(skill.category) ?? [];
    list.push(skill);
    map.set(skill.category, list);
  });
  return [...map.entries()].map(([category, items]) => ({
    category,
    items: sortBySort(items),
  }));
}
