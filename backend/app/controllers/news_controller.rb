class NewsController < ApplicationController
  def index
    uri = URI.parse('https://newsapi.org/v2/everything?country=jp&apiKey=1d0374fdf52a45c2a7e04fb816f0a4a1')
    puts uri
    json = Net::HTTP.get(uri)
    moments = JSON.parse(json)
    # @data = moments['articles'].to_json
    render json: moments
  end

end

