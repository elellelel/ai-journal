class EntryFeedCreator
	def initialize(entry_ids)
		@entries = Entry.where(id: entry_ids)
	end

	def create_feed
		feed = ""

		@entries.each do |entry|
			entry_content = ""
			entry_content += "Entry Title: #{entry.title} "
			entry_content += "Created: #{entry.created_at} "
			entry_content += "Entry Content: #{entry.content} "

			feed += entry_content
		end

		feed
	end
end