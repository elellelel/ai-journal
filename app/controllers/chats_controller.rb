class ChatsController < ApplicationController
  def create
    response = OpenaiService.generate_response(params[:message])
    paragraphs = response.split("\n").reject(&:blank?)
    response = paragraphs.map { |p| "<p>#{p.strip}</p>" }.join

    render json: { message: response }
  end
end
