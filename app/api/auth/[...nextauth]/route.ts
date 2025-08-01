import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/app/lib/db";
import UserModel from "@/app/model/User"
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.OAUTH_CLIENT_ID!,
            clientSecret: process.env.OAUTH_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await connectDB();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email}
                        ]
                    })
                    if (!user) {
                        throw new Error("Email is not registered")
                    }
                    if (!user.password) {
                        throw new Error("User does not have a password set");
                    }
                    if (!credentials.password) {
                        throw new Error("Password is required");
                    }
                    const isMatched = await bcrypt.compare(credentials.password, user.password);
                    if (isMatched) {
                        return user;
                    }
                    else {
                        throw new Error("Password did not match")
                    }
                }
                catch (error) {
                    console.error(error);
                    throw new Error("Problem in the NextAuth Handler");
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                await connectDB();
                try {
                    // Check if user already exists
                    const existingUser = await UserModel.findOne({ email: user.email });
                    
                    if (!existingUser) {
                        // Create new user for Google OAuth
                        const newUser = new UserModel({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            provider: "google",
                            emailVerified: true
                        });
                        await newUser.save();
                    }
                    return true;
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.email = token.email;
            }
            return session
        },
        async jwt({ token, user, account }) {
            if (user) {
                token._id = user._id;
                token.email = user.email;
            }
            if (account?.provider === "google") {
                // Fetch user from database to get _id
                await connectDB();
                const dbUser = await UserModel.findOne({ email: token.email });
                if (dbUser) {
                    token._id = dbUser._id;
                }
            }
            return token
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
})


export {handler as GET,handler as POST}