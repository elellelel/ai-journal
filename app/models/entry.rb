class Entry < ApplicationRecord
	belongs_to :user
	has_one :ai_response

	has_rich_text :content

	def linked_entries
		user.entries.where(id: linked_entry_ids)
	end
end