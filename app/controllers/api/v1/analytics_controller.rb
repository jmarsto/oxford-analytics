class Api::V1::AnalyticsController < ApplicationController
  protect_from_forgery unless: -> { request.format.json? }

  def show
    word = params[:id]
    response = AnalyticsRequest.new(word).response
    if response.status === 404
      head :bad_request
    else
      render json: response.body
    end
  end
end
