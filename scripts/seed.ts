/**
 * 写入初始数据：npm run seed
 * 读取 .env.local 中的 NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 * 使用 service_role 绕过 RLS，幂等 upsert，可重复执行。
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

import {
  seedAwards,
  seedExperiences,
  seedProjects,
  seedSections,
  seedSettings,
  seedSkills,
} from "../src/lib/seed-data";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  console.error(
    "缺少环境变量：请在 .env.local 中填写 NEXT_PUBLIC_SUPABASE_URL 与 SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const jobs: { table: string; rows: unknown[]; onConflict: string }[] = [
  { table: "sections", rows: seedSections, onConflict: "id" },
  { table: "projects", rows: seedProjects, onConflict: "id" },
  { table: "experiences", rows: seedExperiences, onConflict: "id" },
  { table: "skills", rows: seedSkills, onConflict: "id" },
  { table: "awards", rows: seedAwards, onConflict: "id" },
  { table: "settings", rows: seedSettings, onConflict: "key" },
];

async function main() {
  console.log(`→ 连接 ${url}`);

  for (const job of jobs) {
    const { error } = await supabase
      .from(job.table)
      .upsert(job.rows as never[], { onConflict: job.onConflict });

    if (error) {
      console.error(`✗ ${job.table} 写入失败：${error.message}`);
      process.exitCode = 1;
    } else {
      console.log(`✓ ${job.table} 写入 ${job.rows.length} 条`);
    }
  }

  console.log("\n完成。打开 http://localhost:3000 查看 3D 小屋。");
}

void main();
