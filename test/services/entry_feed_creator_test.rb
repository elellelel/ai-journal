require "test_helper"

class EntryFeedCreatorTest < ActiveSupport::TestCase
  setup do
    user = create(:user)
    @entry1 = create(:entry, user: user)
    @entry2 = create(:entry, user: user)
  end

  test "should initialize with valid entry IDs" do
    service = EntryFeedCreator.new([@entry1.id, @entry2.id])
    assert_equal [@entry1, @entry2], service.instance_variable_get(:@entries)
  end

  test "should create a feed with given entry IDs" do
    service = EntryFeedCreator.new([@entry1.id, @entry2.id])
    feed = service.create_feed

    expected_feed = "Entry Title: #{@entry1.title} "\
                    "Created: #{@entry1.created_at} "\
                    "Entry Content: #{@entry1.content} " \
                    "Entry Title: #{@entry2.title} "\
                    "Created: #{@entry2.created_at} "\
                    "Entry Content: #{@entry2.content} "

    assert_equal expected_feed, feed
  end

  test "should create an empty feed when no entry IDs are provided" do
    service = EntryFeedCreator.new([])
    feed = service.create_feed

    assert_equal "", feed
  end

  test "should handle invalid entry IDs gracefully" do
    service = EntryFeedCreator.new([-1, -2])
    feed = service.create_feed

    assert_equal "", feed
  end
end