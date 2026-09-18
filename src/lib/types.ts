export interface Section {
  id: string;
  key: string;
  title: string;
  content: Record<string, unknown>;
  visible: boolean;
  sort: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  link: string;
  period: string;
  visible: boolean;
  sort: number;
}

export interface Experience {
  id: string;
  org: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
  visible: boolean;
  sort: number;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  level: number;
  visible: boolean;
  sort: number;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  category: string;
  visible: boolean;
  sort: number;
}

export interface Setting {
  key: string;
  value: Record<string, unknown>;
  visible: boolean;
  sort: number;
}

export interface PortfolioData {
  sections: Section[];
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  awards: Award[];
  settings: Setting[];
}

export type TableName =
  | "sections"
  | "projects"
  | "experiences"
  | "skills"
  | "awards"
  | "settings";
