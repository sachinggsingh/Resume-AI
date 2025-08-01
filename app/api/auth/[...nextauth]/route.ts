import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/lib/db";
import UserModel from "@/app/model/User"
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
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
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.email = token.email;
            }
            return session
        },
        async jwt({ token, user, }) {
            if (user) {
                token._id = user._id;
                token.email = user.email
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