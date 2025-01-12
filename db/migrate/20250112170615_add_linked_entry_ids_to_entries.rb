class AddLinkedEntryIdsToEntries < ActiveRecord::Migration[8.0]
  def change
    add_column :entries, :linked_entry_ids, :json, default: [], null: false
  end
end
