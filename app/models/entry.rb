class Entry < ApplicationRecord
	belongs_to :user
	has_one :ai_response
end
