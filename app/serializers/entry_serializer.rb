class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :edit_url

  def url
    Rails.application.routes.url_helpers.entry_path(object)
  end

  def edit_url
    Rails.application.routes.url_helpers.edit_entry_path(object)
  end
end