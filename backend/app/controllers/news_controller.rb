class NewsController < ApplicationController
  require 'net/http'
  require 'json'
  require 'open-uri'
  require 'uri'
  require 'rss'

  def index
    # カテゴリ一覧
    rss_urls = {
      sport: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtcGhHZ0pLVUNnQVAB?hl=ja&gl=JP&ceid=JP%3Aja",
      # business: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtcGhHZ0pLVUNnQVAB?hl=ja&gl=JP&ceid=JP%3Aja",
      # technology: "https://news.google.com/rss/topics/CAAqKAgKIiJDQkFTRXdvSkwyMHZNR1ptZHpWbUVnSnFZUm9DU2xBb0FBUAE?hl=ja&gl=JP&ceid=JP%3Aja",
      # entertainment: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtcGhHZ0pLVUNnQVAB?hl=ja&gl=JP&ceid=JP%3Aja"
    }

    # 各カテゴリごとにRSSから記事を取得し、要約を生成する
    articles_by_category = rss_urls.keys.filter_map do |cat|
      rss_url = rss_urls[cat]
      uri = URI.parse(rss_url)
      puts "Fetching RSS from: #{rss_url}"
      rss_content = URI.open(rss_url).read
      puts "RSS Content: #{rss_content}"

      begin
        rss = RSS::Parser.parse(rss_content, false)
      rescue StandardError => e
        Rails.logger.error "RSS parse error: #{e.message}"
        next
      end

      next if rss.nil?

      # 取得する記事を最大3つに制限
      articles = rss.items.first(3).map do |item|
        {
          title: item.title,
          link: item.link,
          description: item.description
        }
      end
      # 記事をまとめてGeminiに送信し、要約を生成
      gemini_response = get_summary_from_gemini(articles)
      {
        category: cat,
        links: articles.map { |a| a[:link] },
        summary: gemini_response[:summary]
      }
    end
    # フロントエンドにJSONで渡す
    render json: articles_by_category
  end

  private

  def get_summary_from_gemini(articles)
    gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    api_key = "AIzaSyBzOUe2vppfM7oRTN7XmHYABNeuu65NpF8"

    # 記事のリンクを一つの文章としてまとめてGeminiに送信
    combined_text = articles.map { |article| "#{article[:title]}: #{article[:description]}" }.join("\n")

    # 生成する記事の内容
    sys_instraction = "あなたは、記事の分野を知らない人にも理解できる記事を作成するジャーナリストです。回答は記事本文のみでお願いします。"
    content = "これらの文章から日本語の新しい記事を１つ生成しなさい。記事は以下の条件を満たす必要があります。:\n"
    content << "- 関連性が高く、小見出しがつながった順序になっている。\n"
    content << "- 全体を500字程度にする。\n"
    content << "- 小見出しをまとめた大きな見出しをつける。\n"
    content << "\n文章は以下の通り。:\n"
    content << combined_text

    # URIオブジェクトを作成
    uri = URI.parse("#{gemini_url}?key=#{api_key}") 
    # POSTリクエストを作成
    request = Net::HTTP::Post.new(uri)  
    # リクエストヘッダーを設定
    # リクエストヘッダーは、リクエストに関する情報を含むヘッダーです。リクエストヘッダーは、リクエストの種類、リクエストの送信元、リクエストの送信先、リクエストの送信先のリソースなどを指定します。
    request["Content-Type"] = "application/json" 
    # リクエストボディを設定
    # リクエストボディは、リクエストに含まれるデータです。リクエストボディは、リクエストの種類によって異なります。たとえば、HTMLフォームのデータ、JSONデータ、XMLデータなどがリクエストボディに含まれます。 
    request.body = {
      contents: [
        { parts: [{ text: combined_text }] }
      ]
    }.to_json # リクエストボディをJSON形式に変換

    # Geminiに要約をリクエスト
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    # レスポンスをパースして要約を取得
    json_response = JSON.parse(response.body, symbolize_names: true)
    {
      # 要約が取得できなかった場合は、"Summary unavailable"を返す
      summary: json_response[:candidates]&.first&.dig(:content, :parts, 0, :text) || "Summary unavailable"
    }
  end
end
