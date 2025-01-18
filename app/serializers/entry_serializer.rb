class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :linked_entry_ids, :url, :editUrl

  def url
    if object.persisted?
      Rails.application.routes.url_helpers.user_entry_path(object.user_id, object)
    else
      ''
    end
  end

  def editUrl
    if object.persisted?
      Rails.application.routes.url_helpers.edit_user_entry_path(object.user_id, object)
    else
      ''
    end
  end
end