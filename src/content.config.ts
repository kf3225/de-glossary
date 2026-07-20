import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

// Starlight の docs コレクション
// カスタム frontmatter (tags, aliases, difficulty, related) を拡張として許可する
const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      tags: z.array(z.string()).optional(),
      aliases: z.array(z.string()).optional(),
      difficulty: z.enum(["basic", "intermediate", "advanced"]).optional(),
      related: z.array(z.string()).optional(),
    }),
  }),
});

export const collections = { docs };
