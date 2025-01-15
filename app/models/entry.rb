class Entry < ApplicationRecord
	belongs_to :user
	has_one :ai_response

	def linked_entries
		user.entries.where(id: linked_entry_ids)
	end
end