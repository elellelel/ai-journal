require "test_helper"

class EntryTest < ActiveSupport::TestCase
  # Test associations
  test "should belong to a user" do
    entry = build(:entry, user: nil)
    assert_not entry.valid?
    assert_includes entry.errors[:user], "must exist"
  end

  test "should have one ai_response" do
    entry = create(:entry)
    ai_response = create(:ai_response, entry: entry)

    assert_equal ai_response, entry.ai_response
  end

  # Test linked_entries method
  test "should return linked entries" do
    user = create(:user)
    entry1 = create(:entry, user: user)
    entry2 = create(:entry, user: user)
    entry3 = create(:entry, user: user)

    # Add linked_entry_ids to entry1
    entry1.update!(linked_entry_ids: [entry2.id, entry3.id])

    # Test linked_entries method
    linked_entries = entry1.linked_entries
    assert_includes linked_entries, entry2
    assert_includes linked_entries, entry3
    assert_equal 2, linked_entries.count
  end
end
