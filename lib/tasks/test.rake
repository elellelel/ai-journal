namespace :test do
  desc "Run Rails tests and JavaScript tests"
  task all: :environment do
    # Run Rails tests
    puts "Running Rails tests..."
    Rake::Task["test:all"].invoke

    # Run JavaScript tests using yarn
    puts "Running JavaScript tests..."
    system("yarn test")

    # Handle errors from the system call
    if $?.exitstatus != 0
      raise "JavaScript tests failed"
    end
  end
end