class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :editUrl

  def url
    Rails.application.routes.url_helpers.user_entry_path(object.user_id, object)
  end

  def editUrl
    Rails.application.routes.url_helpers.edit_user_entry_path(object.user_id, object)
  end
end