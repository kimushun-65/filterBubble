import { NextResponse, NextRequest } from 'next/server';
import articleMock from './article-mock.json';

export async function GET(request: NextRequest) {
  const keyWord = request.nextUrl.searchParams.get('keyWord');
  if (!keyWord) {
    return NextResponse.json(
      { error: 'keyWord query param is required' },
      { status: 400 },
    );
  }
  const data = {
    message: `You searched for "${keyWord}"`,
    article: articleMock,
  };
  return NextResponse.json(data);
}
