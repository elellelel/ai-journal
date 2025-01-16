require "test_helper"

class ChatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in create(:user)
  end
    
  test "should create a chat and return AI response" do
    # Mock dependent services
    EntryFeedCreator.any_instance.stubs(:create_feed).returns("Generated feed content") do
      OpenaiService.stub(:generate_response, "AI response message") do
        # Make the POST request
        post chats_url, params: { chat: { linkedEntryIds: [1, 2] }, message: "Hello, AI!" }

        # Assert the response status
        assert_response :success

        # Parse the JSON response and assert its content
        response_body = JSON.parse(@response.body)
        assert_equal "AI response message", response_body["message"]

        # Additional assertion for content-type
        assert_equal "application/json", @response.content_type
      end
    end
  end
end