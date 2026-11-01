import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { supabase } from "../../infrastructure/database/SupabaseClient";
import { RESPONSE_MESSAGES } from "../constants";

export class HealthController {
  /**
   * Mantém o projeto Supabase ativo (o free tier pausa após 7 dias sem query real).
   * Faz um SELECT trivial na tabela `poupanca` — qualquer query conta como atividade.
   */
  async ping(c: Context) {
    const { error } = await supabase.from("poupanca").select("id").limit(1);

    if (error) {
      throw new HTTPException(503, {
        message: RESPONSE_MESSAGES.HEALTH.DATABASE_UNAVAILABLE,
      });
    }

    return c.json({
      status: "ok",
      database: "up",
      timestamp: new Date().toISOString(),
    });
  }
}
