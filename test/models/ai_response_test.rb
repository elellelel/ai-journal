require "test_helper"

class AiResponseTest < ActiveSupport::TestCase
  test "should belong to an entry" do
    ai_response = build(:ai_response, entry: nil)

    assert_not ai_response.valid?
    assert_includes ai_response.errors[:entry], "must exist"
  end

  test "should be valid with an entry" do
    ai_response = create(:ai_response)
    
    assert ai_response.valid?
  end
end
