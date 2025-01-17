ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "mocha/minitest"
require "minitest/mock"
require 'capybara/rails'
require 'capybara/minitest'
require 'webmock/minitest'

WebMock.disable_net_connect!(allow_localhost: true)

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Add more helper methods to be used by all tests here...
    def create(*args)
      FactoryBot.create(*args)
    end

    def build(*args)
      FactoryBot.build(*args)
    end

    # Because Devise sign_in helpers are not working >:{
    def sign_in(user = nil)
      ApplicationController.any_instance.stubs(:authenticate_user!).returns(true)
      user ||= create(:user)
      ApplicationController.any_instance.stubs(:current_user).returns(user)
    end
  end
end