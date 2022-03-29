type CredentialsTokyo42 = {
  name: string;
  password: string;
};

type CredentialsDiscord = {
  email: string;
  password: string;
};

type Credentials = {
  tokyo42: CredentialsTokyo42;
  discord: CredentialsDiscord;
};

const setCredentials = (envVars: NodeJS.ProcessEnv) => {
  if (!envVars.TOKYO_42_USERNAME)
    throw new Error("TOKYO_42_USERNAME is not defined");
  if (!envVars.TOKYO_42_PASSWORD)
    throw new Error("TOKYO_42_PASSWORD is not defined");
  if (!envVars.DISCORD_EMAIL)
    throw new Error("DISCORD_PASSWORD is not defined");
  if (!envVars.DISCORD_PASSWORD)
    throw new Error("DISCORD_PASSWORD is not defined");

  const credentials: Credentials = {
    tokyo42: {
      name: envVars.TOKYO_42_USERNAME,
      password: envVars.TOKYO_42_PASSWORD,
    },
    discord: {
      email: envVars.DISCORD_EMAIL,
      password: envVars.DISCORD_PASSWORD,
    },
  };

  return credentials;
};

export { setCredentials, CredentialsTokyo42, CredentialsDiscord, Credentials };
