import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/spendwise'),
  JWT_SECRET: z.string().min(16).default('development-only-change-me-please'),
  FRONTEND_ORIGIN: z.string().default('http://localhost:3000'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false').transform(v => v === 'true')
});
export const config = schema.parse(process.env);
