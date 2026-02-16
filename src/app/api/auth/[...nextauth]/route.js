import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";

const hasGoogleProvider =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await dbConnect("users").findOne({
        email: credentials.email,
      });

      if (!user || !user.password) return null;

      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (!isValid) return null;

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.photo,
        role: user.role,
      };
    },
  }),
];

if (hasGoogleProvider) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      if (!user?.email) return false;

      const users = dbConnect("users");
      const existingUser = await users.findOne({ email: user.email });

      if (!existingUser) {
        const newUser = {
          name: user.name || user.email.split("@")[0],
          email: user.email,
          photo: user.image || "",
          role: "user",
          authProvider: "google",
          createdAt: new Date().toISOString(),
        };

        await users.insertOne(newUser);
        return true;
      }

      const updates = {};
      if (!existingUser.photo && user.image) updates.photo = user.image;
      if (!existingUser.name && user.name) updates.name = user.name;
      if (!existingUser.authProvider) updates.authProvider = "google";

      if (Object.keys(updates).length > 0) {
        await users.updateOne({ _id: existingUser._id }, { $set: updates });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await dbConnect("users").findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role || "user";
          token.picture = dbUser.photo || token.picture;
          token.name = dbUser.name || token.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
