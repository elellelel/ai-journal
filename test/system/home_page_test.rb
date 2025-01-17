require "application_system_test_case"

class RootRedirectTest < ApplicationSystemTestCase
  test "visiting the root path redirects to sign in" do
    visit root_path

    assert_current_path new_user_session_path
  end

  test "user is redirected home when they sign in" do 
    sign_in create(:user)

    assert_current_path root_path
    assert find('p.notice', text: 'Signed in successfully.')
  end

  test "user attaches entries to the chatbox" do 
    user = create(:user)
    entry1 = create(:entry, user: user)
    entry2 = create(:entry, user: user)

    request_body = "{\"model\":\"gpt-4\",\"messages\":[{\"role\":\"user\",\"content\":\"HelloEntry Title: #{entry1.title} Created: #{entry1.created_at} Entry Content: #{entry1.content} Entry Title: #{entry2.title} Created: #{entry2.created_at} Entry Content: #{entry2.content} \"}]}"
    response_body = {"choices" =>
                      [{"index" => 0,
                        "message" => {"role" => "assistant", "content" => "Hello! How can I assist you today?", "refusal" => nil},
                        "logprobs" => nil,
                        "finish_reason" => "stop"}],
                    }

    stub_request(:post, "https://api.openai.com/v1/chat/completions").
      with(body: request_body,).
      to_return(status: 200, body: response_body.to_json, headers: {})

    sign_in(user)

    assert page.has_content? entry1.title
    assert page.has_content? entry2.title

    boxes = find_all('.entry-checkbox')

    refute boxes.any?(&:checked?)

    # Yeah sometimes Capybara just refuses to interact with an element
    # TODO: get `find('#selectAll').click` to work >_>
    page.execute_script("document.getElementById('selectAll').click()")

    assert boxes.all?(&:checked)

    fill_in 'Type your message here...', with: 'Hello'
    click_button 'Send'

    assert_equal '', find('#chatInput').value
    assert page.has_content?('Hello')
    assert page.has_content?('Hello! How can I assist you today?')
  end
end
  