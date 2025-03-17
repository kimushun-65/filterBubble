class NewsController < ApplicationController
  API_KEY = "1d0374fdf52a45c2a7e04fb816f0a4a1"
  BASE_URL = 'https://newsapi.org/v2/top-headlines'
  def index
    category = params[:category]
    keyword = params[:keyword]

    query = {
      apiKey: API_KEY,
      country: 'jp',   # 国内のニュースを取得
      # language: 'ja',  # 日本語のニュースを取得
      #category: category.presence, # カテゴリー指定
      #q: keyword.presence # キーワード検索
    }.compact # nilを削除

    response = HTTParty.get(BASE_URL, query: query) # GETリクエストを送信

    if response.success?
      render json: response.parsed_response
    else
      Rails.logger.error "NewsAPI Error: #{response.body}"
      render json: { error: 'Failed to get news', details: response.parsed_response }, status: :bad_request
    end

    def data
      uri = URI.parse('https://newsapi.org/v2/everything?country=jp&apiKey=1d0374fdf52a45c2a7e04fb816f0a4a1')
      puts uri
      json = Net::HTTP.get(uri)
      puts json
      moments = JSON.parse(json)
      # @data = moments['articles'].to_json
      rendar json: moments
    end
  end
end
