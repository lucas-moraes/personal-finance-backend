import Joi from "joi";
import { RESPONSE_MESSAGES } from "../constants";
import { HTTPException } from "hono/http-exception";

export const validateAuthLogIn = (body: { email: string; password: string }) => {
  const authValidationSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = authValidationSchema.validate(body);

  if (error) throw new HTTPException(400, { message: RESPONSE_MESSAGES.AUTH.INVALID_LOGIN });
};
