require "test_helper"

class EntriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @entry = create(:entry, user: @user)

    sign_in @user
  end

  # INDEX
  test "should get index with user's entries (HTML)" do
    get user_entries_url(@user)
    assert_response :success
  end

  test "should get index with user's entries (JSON)" do
    get user_entries_url(@user, format: :json)
    assert_response :success

    json_response = JSON.parse(@response.body)
    assert_equal 1, json_response["entries"].count
    assert_equal @entry.id, json_response["entries"].first["id"]
  end

  # SHOW
  test "should show entry" do
    get user_entry_url(@user, @entry)
    assert_response :success
  end

  # NEW
  test "should get new entry form" do
    get new_user_entry_url(@user)
    assert_response :success
  end

  # CREATE
  test "should create entry (HTML)" do
    assert_difference("Entry.count", 1) do
      post user_entries_url(@user), params: { entry: { title: "New Entry", content: "New Content" } }
    end
    assert_redirected_to user_entry_url(@user, Entry.last)
    follow_redirect!
    assert_select "p", "Entry was successfully created."
  end

  test "should create entry (JSON)" do
    assert_difference("Entry.count", 1) do
      post user_entries_url(@user, format: :json), params: { entry: { title: "New Entry", content: "New Content" } }
    end
    assert_response :created

    json_response = JSON.parse(@response.body)
    assert_equal "New Entry", json_response["entry"]["title"]
  end

  # CREATE with AI response
  test "should create entry with AI response" do
    EntryFeedCreator.any_instance.stubs(:create_feed).returns("Generated feed content") do
      OpenaiService.stub(:generate_response, "<p>Generated AI response</p>") do
        assert_difference(["Entry.count", "AiResponse.count"], 1) do
          post user_entries_url(@user), params: {
            entry: {
              title: "AI Entry",
              content: "AI Generated",
              generate_ai_response: true
            }
          }
        end

        entry = Entry.last
        assert_equal "<p>Generated AI response</p>", entry.ai_response.content
      end
    end
  end

  # EDIT
  test "should get edit form for entry" do
    get edit_user_entry_url(@user, @entry)
    assert_response :success
  end

  # UPDATE
  test "should update entry" do
    patch user_entry_url(@user, @entry), params: { entry: { title: "Updated Title" } }
    assert_redirected_to user_entry_url(@user, @entry)
    follow_redirect!
    assert_select "p", "Entry was successfully updated."
    assert_equal "Updated Title", @entry.reload.title
  end

  # DESTROY
  test "should destroy entry (HTML)" do
    assert_difference("Entry.count", -1) do
      delete user_entry_url(@user, @entry)
    end
    assert_redirected_to root_url
    follow_redirect!
    assert_select "p", "Entry was successfully destroyed."
  end

  test "should destroy entry (JSON)" do
    assert_difference("Entry.count", -1) do
      delete user_entry_url(@user, @entry, format: :json)
    end
    assert_response :ok

    json_response = JSON.parse(@response.body)
    assert json_response["success"]
  end
end
