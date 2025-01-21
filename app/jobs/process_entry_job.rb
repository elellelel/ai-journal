class ProcessEntryJob < ApplicationJob
  queue_as :default

  def perform(entry)
    ids = [entry.id] + entry.linked_entry_ids
    
    content = EntryFeedCreator.new(ids).create_feed
    response = OpenaiService.generate_response(content)

    paragraphs = response.split("\n").reject(&:blank?)
    response = paragraphs.map { |p| "<p>#{p.strip}</p>" }.join

    entry.ai_response = AiResponse.create(content: response)
  end
end
