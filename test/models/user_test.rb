 require "test_helper"

class UserTest < ActiveSupport::TestCase
  # Test associations
  test "should have many entries" do
    user = create(:user)
    entry1 = create(:entry, user: user)
    entry2 = create(:entry, user: user)

    assert_includes user.entries, entry1
    assert_includes user.entries, entry2
    assert_equal 2, user.entries.count
  end

  # Test validations
  test "should require email and password" do
    user = build(:user, email: nil, password: nil)
    assert_not user.valid?
    assert_includes user.errors[:email], "can't be blank"
    assert_includes user.errors[:password], "can't be blank"
  end

  test "should require a valid email format" do
    user = build(:user, email: "invalidemail", password: "password")
    assert_not user.valid?
    assert_includes user.errors[:email], "is invalid"
  end

  # Test Devise functionality
  test "should encrypt password" do
    user = create(:user, password: 'password')
    assert_not_equal "password", user.encrypted_password
    assert user.valid_password?("password")
  end
end