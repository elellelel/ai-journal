require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @entry1 = create(:entry, user: @user)
    @entry2 = create(:entry, user: @user)
  end

  # Test when the user is signed in
  test "should get index with serialized entries for signed-in user" do
    sign_in @user
    get root_url
    assert_response :success
  end

  # Test when the user is not signed in
  test "should redirect to sign-in when not signed in" do
    get root_url
    assert_redirected_to new_user_session_path
  end
end
