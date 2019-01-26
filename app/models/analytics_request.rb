require "faraday"

class AnalyticsRequest
  def initialize(word)
    @word = word
  end

  def response
    api_url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en'

    conn = Faraday.new(:url => "#{api_url}/#{@word}") do |faraday|
      faraday.request  :url_encoded
      faraday.response :logger do | logger |
        logger.filter(/(app_id: ")(\w+)/,'\1[REMOVED]')
        logger.filter(/(app_key: ")(\w+)/,'\1[REMOVED]')
      end
      faraday.adapter  Faraday.default_adapter
    end

    binding.pry

    api_response = conn.get do |req|
      req.headers['app_id'] = ENV["app_id"]
      req.headers['app_key'] = ENV["app_key"]
    end

    api_response.body
  end
end
