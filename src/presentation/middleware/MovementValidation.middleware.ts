import Joi from "joi";
import { RESPONSE_MESSAGES } from "../constants";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

const movementValidationSchema = Joi.object({
  dia: Joi.number().required(),
  mes: Joi.number().required(),
  ano: Joi.number().required(),
  tipo: Joi.string().required(),
  categoria: Joi.number().required(),
  descricao: Joi.string().optional(),
  valor: Joi.number().required(),
});

export const validateCreateMovement = async (c: Context) => {
  try {
    const { user, ...data } = await c.req.json();
    const { error } = movementValidationSchema.validate(data);
  } catch (error) {}
};

export const validateMultipleMovementsCreation = (c: Context) => {
  try {
    const data = c.req.json();
    const { error } = Joi.array().items(movementValidationSchema).validate(data);
  } catch (error) {}
};

export const validatePatchMovement = (c: Context) => {
  try {
    const data = c.req.json();

    if (Object.keys(data).length === 0 || c.req.param().id === undefined) {
      throw new HTTPException(400, { message: RESPONSE_MESSAGES.MOVEMENT.PARAMETERS_IS_EMPTY });
    }

    const { error } = Joi.object({
      dia: Joi.number().optional(),
      mes: Joi.number().optional(),
      ano: Joi.number().optional(),
      tipo: Joi.string().optional(),
      categoria: Joi.number().optional(),
      descricao: Joi.string().optional(),
      valor: Joi.number().optional(),
    }).validate(data);

    if (error) {
      throw new HTTPException(400, { message: error.details[0].message });
    }
  } catch (error) {}
};
