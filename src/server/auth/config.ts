import { env } from "@/env";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  
  providers: [
    // DiscordProvider,
    GitHub({
      clientId: env.AUTH_GITHUB_ID as string,
      clientSecret: env.AUTH_GITHUB_SECRET as string
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    session: ({ session, user, token }) => {
      console.log("session", session);
      console.log("token", token);
      console.log("user", user);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
} satisfies NextAuthConfig;
