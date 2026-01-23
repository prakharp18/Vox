import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';
import { z } from 'zod';

const UsernameQuerySchema = z.object({
  username: z.string(),
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username'),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const user = await UserModel.findOne({ username, isVerified: true });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessages,
        message: 'User status fetched successfully',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching user status:', error);
    return NextResponse.json(
      { success: false, message: 'Error checking user status' },
      { status: 500 }
    );
  }
}
