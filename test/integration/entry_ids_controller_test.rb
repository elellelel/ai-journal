require "test_helper"

class EntryIdsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @entry1 = create(:entry, user: @user)
    @entry2 = create(:entry, user: @user)
    
    sign_in @user
  end

  # Test for successful response with valid user_id
  test "should return entry IDs for the user" do
    get user_entry_ids_url(@user)
    assert_response :success

    json_response = JSON.parse(@response.body)
    assert_equal [@entry1.id, @entry2.id], json_response["entry_ids"]
  end

  # Test for user not found
  test "should return not_found when user does not exist" do
    get user_entry_ids_url(-1) # Pass a non-existent user ID
    assert_response :not_found

    json_response = JSON.parse(@response.body)
    assert_equal "User not found", json_response["error"]
  end

  # Test for no entries
  test "should return an empty array when user has no entries" do
    @user.entries.destroy_all
    get user_entry_ids_url(@user)
    assert_response :success

    json_response = JSON.parse(@response.body)
    assert_equal [], json_response["entry_ids"]
  end
end
