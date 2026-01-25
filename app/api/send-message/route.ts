import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';
import { messageSchema } from '@/schemas/messageSchema';
import { Message } from '@/model/user';
import { messageRateLimiter } from '@/lib/rate-limit';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, content } = await req.json();

    try {
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      await messageRateLimiter.check(10, ip);
    } catch {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
       return NextResponse.json(
        { message: 'User is not accepting messages' },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 }
    );
  }
}
