class NewsController < ApplicationController
  require 'net/http'
  require 'json'
  require 'open-uri'
  require 'uri'
  require 'rss'
  require 'cgi'

  # カテゴリ一覧
  # rss_urls = {
  #   sport: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtcGhHZ0pLVUNnQVAB?hl=ja&gl=JP&ceid=JP%3Aja",
  #   business: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtcGhHZ0pLVUNnQVAB?hl=ja&gl=JP&ceid=JP%3Aja",
  #   technology: "https://news.google.com/rss/topics/CAAqKAgKIiJDQkFTRXdvSkwyMHZNR1ptZHpWbUVnSnFZUm9DU2xBb0FBUAE?hl=ja&gl=JP&ceid=JP%3Aja",
  #   entertainment: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtcGhHZ0pLVUNnQVAB?hl=ja&gl=JP&ceid=JP%3Aja"
  # }

  def index
    query = params[:query]
    encoded_query = CGI.escape(query) # クエリをエンコード
    rss_url = "https://news.google.com/rss/search?q=#{encoded_query}&hl=ja&gl=JP&ceid=JP%3Aja"

    uri = URI.parse(rss_url)
    puts "Fetching RSS from: #{rss_url}"
    rss_content = URI.open(rss_url).read
    puts "RSS Content: #{rss_content}"
    rss = RSS::Parser.parse(rss_content, false)

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

    render json:{
      keyword: query,
      title: gemini_response[:title],
      links: articles.map { |a| a[:link] },
      summary: gemini_response[:summary]
    }
  end


  private

  def get_summary_from_gemini(articles)
    gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-exp-02-05:generateContent"
    api_key = "AIzaSyBzOUe2vppfM7oRTN7XmHYABNeuu65NpF8"

    # 記事のリンクを一つの文章としてまとめてGeminiに送信
    combined_text = articles.map { |article| "#{article[:title]}: #{article[:description]}" }.join("\n")

    # 生成する記事の内容
    sys_instraction = "あなたは、記事の分野を知らない人にも理解できる記事を作成するジャーナリストです。回答は記事本文のみでお願いします。"
    content = <<~TEXT
      これらの文章から日本語の新しい記事を１つ生成しなさい。記事は以下の条件を満たす必要があります:
      - タイトルは#を１つ置くこと。 3つの記事の共有点をピックアップして簡潔にまとめたもの（最大30字）
      - 本文は##を２つ置くこと。 3つの記事の共有点をピックアップして、記事にしなさい。小見出しや大見出しなどのMarkdown記法を使いなさい。
      - 本文はMarkdown形式で**絶対**500字程度の内容。
      - 「以下に、各ニュース記事の概要をまとめます」類の言葉はいらない。
      文章は以下の通り。:
      #{combined_text}
    TEXT

    # URIオブジェクトを作成
    uri = URI.parse("#{gemini_url}?key=#{api_key}") 
    # POSTリクエストを作成
    request = Net::HTTP::Post.new(uri)  
    # リクエストヘッダーを設定
    # リクエストヘッダーは、リクエストに関する情報を含むヘッダーです。リクエストヘッダーは、リクエストの種類、リクエストの送信元、リクエストの送信先、リクエストの送信先のリソースなどを指定します。
    request["Content-Type"] = "application/json" 
    # リクエストボディを設定
    # リクエストボディは、リクエストに含まれるデータです。リクエストボディは、リクエストの種類によって異なります。たとえば、HTMLフォームのデータ、JSONデータ、XMLデータなどがリクエストボディに含まれます。
    request.body = { contents: [{ parts: [{ text: content }] }] }.to_json

    # Geminiに要約をリクエスト  
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(request) }
    json_response = JSON.parse(response.body, symbolize_names: true)

    response_text = json_response[:candidates]&.first&.dig(:content, :parts, 0, :text) || "Summary unavailable"
    
    # タイトルを取得 (`#` で始まる最初の行)
    title_match = response_text.match(/^\#\s*(.+)$/)
    title = title_match ? title_match[1].strip : "タイトル不明"

    # 本文を取得 (`##` から始まる部分を抜き出す)
    summary_match = response_text.match(/^\#\#\s*(.+)/m)
    summary = summary_match ? summary_match[1].strip : "本文が生成されませんでした"

    { title: title, summary: summary }
  end
end
