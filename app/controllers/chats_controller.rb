class ChatsController < ApplicationController
  def create
    render json: { message: OpenaiService.generate_response(params[:message]) }
  end
end
