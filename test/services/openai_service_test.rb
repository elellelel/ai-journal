require "test_helper"

class OpenaiServiceTest < ActiveSupport::TestCase
  test "should generate a formatted response from OpenAI" do
    # Define the mock response from the API
    mock_response = {
      "choices" => [
        {
          "message" => {
            "content" => "This is a test response.\nIt has multiple lines."
          }
        }
      ]
    }

    # Stub the OpenAI client
    mock_client = mock("OpenAI::Client")
    mock_client.expects(:chat).with(
      parameters: {
        model: "gpt-4",
        messages: [
          { role: "user", content: "Test prompt" }
        ]
      }
    ).returns(mock_response)

    # Stub `OpenAI::Client.new` to return the mocked client
    OpenAI::Client.stubs(:new).returns(mock_client)

    # Call the method under test
    result = OpenaiService.generate_response("Test prompt")

    # Assertions
    assert_equal "<p>This is a test response.</p><p>It has multiple lines.</p>", result
  end
end
