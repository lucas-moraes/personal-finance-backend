import Joi from "joi";
import { RESPONSE_MESSAGES } from "../constants";
import { HTTPException } from "hono/http-exception";
import { Context, Next } from "hono";

export const validateAuthLogIn = async (c: Context, next: Next) => {
  const body = await c.req.json();

  if (!body) {
    throw new HTTPException(400, { message: RESPONSE_MESSAGES.AUTH.INVALID_LOGIN });
  }

  const authValidationSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = authValidationSchema.validate(body);

  if (error) throw new HTTPException(400, { message: RESPONSE_MESSAGES.AUTH.INVALID_LOGIN });

  return next();
};
