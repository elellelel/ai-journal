require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [ 1400, 1400 ]
  # For easier debugging during tests, comment out the above line and uncomment
  # the one below:
  # driven_by :selenium, using: :chrome, screen_size: [ 1400, 1400 ]

  def sign_in(user = nil)
    user ||= create(:user)

    visit new_user_session_path

    fill_in 'Email', with: user.email
    fill_in 'Password', with: user.password

    click_button 'Log in'
  end
end
