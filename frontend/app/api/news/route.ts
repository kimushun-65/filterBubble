import { NextResponse, NextRequest } from 'next/server';
import articleMock from './article-mock.json';

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('keyword');
  if (!keyword) {
    return NextResponse.json(
      { error: 'keyword query param is required' },
      { status: 400 },
    );
  }
  const data = {
    message: `You searched for "${keyword}"`,
    article: articleMock,
  };
  return NextResponse.json(data);
}
