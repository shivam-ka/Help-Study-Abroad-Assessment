import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        MONGODB_URI: z.string().url(),
        ACCESS_TOKEN_SECRET: z.string().min(10),
        GEMINI_API_KEY: z.string(),
    },
    runtimeEnv: {
        MONGODB_URI: process.env.MONGODB_URI,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
});
