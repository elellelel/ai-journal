class Entry < ApplicationRecord
	belongs_to :user
	has_one :ai_response

	has_rich_text :content

	def linked_entries
		user.entries.where(id: linked_entry_ids)
	end

	def url
  		Rails.application.routes.url_helpers.entry_path(self)
	end

	def edit_url
  		Rails.application.routes.url_helpers.edit_entry_path(self)
	end
end