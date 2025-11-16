export const oAuthProvider = {
  google: {
    authUrl: process.env.GOOGLE_OAUTH_AUTH_URL!,
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI!,
    tokenParams: {
      grant_type: "authorization_code",
    },
    responseType: "code",
    scope: "email profile",
  },
  github: {
    authUrl: process.env.GITHUB_OAUTH_AUTH_URL!,
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
    clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
    redirectUri: process.env.GITHUB_OAUTH_REDIRECT_URI!,
    tokenParams: {
      grant_type: "authorization_code",
    },
    responseType: "code",
    scope: "user",
  },
  discord: {
    authUrl: process.env.DISCORD_OAUTH_AUTH_URL!,
    tokenUrl: "https://discord.com/api/oauth2/token",
    userInfoUrl: "https://discord.com/api/users/@me",
    clientId: process.env.DISCORD_OAUTH_CLIENT_ID!,
    clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET!,
    redirectUri: process.env.DISCORD_OAUTH_REDIRECT_URI!,
    tokenParams: {
      grant_type: "authorization_code",
    },
    responseType: "code",
    scope: "email+identify",
  },
  facebook: {
    authUrl: process.env.FACEBOOK_OAUTH_AUTH_URL!,
    tokenUrl: "https://graph.facebook.com/v24.0/oauth/access_token",
    userInfoUrl: "https://graph.facebook.com/me?fields=id,name,email",
    clientId: process.env.FACEBOOK_OAUTH_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET!,
    redirectUri: process.env.FACEBOOK_OAUTH_REDIRECT_URI!,
    tokenParams: {
      grant_type: "authorization_code",
    },
    responseType: "code",
    scope: "public_profile email",
  },
} as const;
