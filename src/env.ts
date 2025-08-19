import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        MONGODB_URI: z.string().url(),
        ACCESS_TOKEN_SECRET: z.string().min(10),
    },
    runtimeEnv: {
        MONGODB_URI: process.env.MONGODB_URI,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    },
});
