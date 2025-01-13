class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :editUrl

  def url
    Rails.application.routes.url_helpers.entry_path(object)
  end

  def editUrl
    Rails.application.routes.url_helpers.edit_entry_path(object)
  end
end