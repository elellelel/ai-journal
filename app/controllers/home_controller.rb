class HomeController < ApplicationController
	def index
	  entries = current_user.entries
	  @serialized_entries = ActiveModelSerializers::SerializableResource.new(entries)
	end
end
