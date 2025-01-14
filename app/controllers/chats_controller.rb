class ChatsController < ApplicationController
  def create
    entry_ids = params[:chat][:linkedEntryIds]
    content = EntryFeedCreator.new(entry_ids).create_feed

    response = OpenaiService.generate_response(content)

    paragraphs = response.split("\n").reject(&:blank?)
    response = paragraphs.map { |p| "<p>#{p.strip}</p>" }.join

    render json: { message: response }
  end
end