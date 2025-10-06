import Joi from "joi";
import type { Context } from "hono";

const categoryValidationSchema = Joi.object({
  description: Joi.string().required(),
});

export const validateCreateCategory = async (c: Context) => {
  try {
    const { user, ...data } = await c.req.json();
    const { error } = categoryValidationSchema.validate(data);
  } catch (error) {}
};
