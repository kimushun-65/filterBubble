import { NextRequest, NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams.get('keyword');
  if (!query) {
    return NextResponse.json({ error: 'keyword query param is required' }, { status: 400 });
  }

  const encodedQuery = encodeURIComponent(query);
  const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=ja&gl=JP&ceid=JP%3Aja`;

  const rssResponse = await fetch(rssUrl);
  const rssText = await rssResponse.text();

  const parsedRss = await parseStringPromise(rssText, { trim: true });
  const items = parsedRss.rss.channel[0].item.slice(0, 3);

  const articles = items.map((item: any) => ({
    title: item.title[0],
    link: item.link[0],
    description: item.description[0]
  }));

  const geminiResponse = await getSummaryFromGemini(articles);

  return NextResponse.json({
    keyword: query,
    title: geminiResponse.title,
    links: articles.map((a: string) => a.link),
    summary: geminiResponse.summary
  });
};

async function getSummaryFromGemini(articles: { title: string; description: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY; // 環境変数で管理
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const combinedText = articles
    .map(article => `${article.title}: ${article.description}`)
    .join('\n');

  const sysInstruction = `あなたは、記事の分野を知らない人にも理解できる記事を作成するジャーナリストです。回答は記事本文のみでお願いします。`;
  const content = `${sysInstruction}\nこれらの文章から日本語の新しい記事を１つ生成しなさい。記事は以下の条件を満たす必要があります。:\n` +
    `以下の2つの項目を必ず返してください:\n` +
    `- タイトルは#を１つ置くこと。 記事の要点を簡潔にまとめたもの（最大30字）\n` +
    `- **本文**: 関連性が高く、Markdown形式で絶対に500字程度の内容\n` +
    `- 「以下に、各ニュース記事の概要をまとめます」類の言葉はいらない。\n\n` +
    `文章は以下の通り。:\n${combinedText}`;

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: content }] }]
      })
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Response body: ${errorText.substring(0, 200)}...`);
      return { 
        title: "APIエラーが発生しました", 
        summary: "申し訳ありませんが、要約の生成中にエラーが発生しました。" 
      };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Invalid content type: ${contentType}`);
      const errorText = await response.text();
      console.error(`Response body: ${errorText.substring(0, 200)}...`);
      return { 
        title: "レスポンス形式エラー", 
        summary: "APIからの応答が正しいJSON形式ではありませんでした。" 
      };
    }

    const json = await response.json();
    const responseText = json?.candidates?.[0]?.content?.parts?.[0]?.text || 'Summary unavailable';

    const titleMatch = responseText.match(/^#*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'タイトル不明';
    const summary = responseText.replace(/^#.*\n/, '');

    return { title, summary };
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    return { 
      title: "エラーが発生しました", 
      summary: "ニュース要約の生成中に技術的な問題が発生しました。" 
    };
  }
}
