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
    combined_text = articles.map { |article| "Summarize this article: #{article[:link]}" }.join("\n")

    uri = URI.parse("#{gemini_url}?key=#{api_key}")
    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/json"
    request.body = {
      contents: [
        { parts: [{ text: combined_text }] }
      ]
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    json_response = JSON.parse(response.body, symbolize_names: true)
    {
      summary: json_response[:candidates]&.first&.dig(:content, :parts, 0, :text) || "Summary unavailable"
    }
  end
end
