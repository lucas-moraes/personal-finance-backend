export const RESPONSE_MESSAGES = {
  CATECOGRY: { ALL_READY_EXIST: "A categoria já está cadastrada" },
  MOVEMENT: { PARAMETERS_IS_EMPTY: "Parametros não informados" },
  AUTH: {
    INVALID_LOGIN: "Usuário ou senha inválidos",
    INVALID_LOGOUT: "Não foi possível realizar o logout",
    INVALID_TOKEN: "Token inválido",
  },
  HEALTH: {
    DATABASE_UNAVAILABLE: "Banco de dados indisponível",
  },
};

export const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: "*",
  credentials: true,
};
