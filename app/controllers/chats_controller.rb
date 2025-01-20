class ChatsController < ApplicationController
  def create
    entry_ids = params[:chat][:linkedEntries].map { |e| e["id"] }
    content = EntryFeedCreator.new(entry_ids).create_feed

    response = OpenaiService.generate_response(params[:message] + content)

    render json: { message: response }
  end
end