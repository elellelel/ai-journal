class EntryIdsController < ApplicationController
	def index
	    user = User.find(params[:user_id])
	    entry_ids = user.entries.pluck(:id) # Fetch all entry IDs for the user
	    render json: { entry_ids: entry_ids }, status: :ok
	  rescue ActiveRecord::RecordNotFound
	    render json: { error: "User not found" }, status: :not_found
	end
end
