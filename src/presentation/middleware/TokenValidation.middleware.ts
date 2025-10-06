import { RESPONSE_MESSAGES } from "../constants";
import { supabase } from "../../infrastructure/database/SupabaseClient";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const tokenValidation = async (c: Context, next: Next) => {
  const token = c.req.header().authorization?.split(" ")[1];
  if (!token) throw new HTTPException(401, { message: RESPONSE_MESSAGES.AUTH.INVALID_TOKEN });

  const { error } = await supabase.auth.getUser(token);
  if (error) throw new HTTPException(401, { message: RESPONSE_MESSAGES.AUTH.INVALID_TOKEN });

  await next();
};
