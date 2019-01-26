class Api::V1::AnalyticsController < ApplicationController
  protect_from_forgery unless: -> { request.format.json? }

  def show
    word = params[:id]
    body = AnalyticsRequest.new(word).response
    render json: body
  end
end
