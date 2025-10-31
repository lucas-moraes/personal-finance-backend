import { RESPONSE_MESSAGES } from "../constants/index";
import { supabase } from "../../infrastructure/database/SupabaseClient";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const logIn = async (c: Context) => {
  const { email, password } = await c.req.json();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new HTTPException(400, { message: RESPONSE_MESSAGES.AUTH.INVALID_LOGIN });
  }

  return c.json({ token: data.session.access_token });
};

export const logOut = async (c: Context) => {
  const data = await supabase.auth.signOut();

  if (data.error) {
    throw new HTTPException(400, { message: RESPONSE_MESSAGES.AUTH.INVALID_LOGOUT });
  }

  return c.json({ message: "successfully logged out" });
};

export const loggedInUser = async (c: Context, next: Next) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new HTTPException(401, { message: RESPONSE_MESSAGES.AUTH.INVALID_TOKEN });
  }

  c.set("user", user);
  await next();
};
