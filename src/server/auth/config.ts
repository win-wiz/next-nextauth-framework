import { env } from "@/env";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

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
  // 确保使用 NEXTAUTH_SECRET 环境变量作为密钥
  secret: env.AUTH_SECRET,
  // 配置 JWT
  jwt: {
    // 设置 JWT 的过期时间为 30 天
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  // 配置 session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    updateAge: 24 * 60 * 60, // 24 hours in seconds
  },
  // 配置 providers
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID as string,
      clientSecret: env.AUTH_GITHUB_SECRET as string,
    }),
    Google({
      clientId: env.AUTH_GOOGLE_ID as string,
      clientSecret: env.AUTH_GOOGLE_SECRET as string
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      // 初次登录时，将用户信息添加到 token 中
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;

        // console.log(`调用/auth/login接口====>>>>${env.REQUEST_BASE_URL}/auth/login`, user);
        // 同步用户信息到 workers
        try {
          const response = await fetch(`${env.REQUEST_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              accessToken: account.access_token
            })
          });

          const result = await response.json();
          console.log('response result ====>>>>>', result);
          
          if (!response.ok) {
            console.error('Failed to sync user data to workers');
          }
        } catch (error) {
          console.error('Error syncing user data to workers:', error);
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email!;
        // 将 accessToken 添加到 session 中，以便客户端使用
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  }
} satisfies NextAuthConfig;
