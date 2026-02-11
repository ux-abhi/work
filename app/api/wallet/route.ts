import { NextRequest, NextResponse } from 'next/server';
import { generatePass, getPassMimeType } from '@/lib/passkit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, bio, profileUrl } = body;

    if (!name || !username || !profileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const passBuffer = await generatePass({
      name,
      username,
      bio,
      profileUrl,
    });

    return new NextResponse(passBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': getPassMimeType(),
        'Content-Disposition': `attachment; filename="linkcard-${username}.pkpass"`,
      },
    });
  } catch (error) {
    console.error('Wallet pass generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Apple Wallet pass' },
      { status: 500 }
    );
  }
}
