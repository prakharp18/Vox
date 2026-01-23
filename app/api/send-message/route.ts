import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';
import { messageSchema } from '@/schemas/messageSchema';
import { Message } from '@/model/user';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, content } = await req.json();

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
