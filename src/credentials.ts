type CredentialsDiscord = {
  email: string;
  password: string;
};

type Credentials = {
  discord: CredentialsDiscord;
};

const setCredentials = (envVars: NodeJS.ProcessEnv) => {
  if (!envVars.DISCORD_EMAIL)
    throw new Error("DISCORD_PASSWORD is not defined. create .env file");
  if (!envVars.DISCORD_PASSWORD)
    throw new Error("DISCORD_PASSWORD is not defined. create .env file");

  const credentials: Credentials = {
    discord: {
      email: envVars.DISCORD_EMAIL,
      password: envVars.DISCORD_PASSWORD,
    },
  };

  return credentials;
};

export { setCredentials, CredentialsDiscord, Credentials };
