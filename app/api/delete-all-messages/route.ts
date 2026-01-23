import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $set: { messages: [] } }
        );

        if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 0) {
            return Response.json(
                { success: false, message: "User not found or already cleared" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "All messages deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting all messages:", error);
        return Response.json(
            { success: false, message: "Error deleting all messages" },
            { status: 500 }
        );
    }
}
