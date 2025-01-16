# AI Journal

AI Journal is a web-based application designed to manage and enhance journal entries using AI-powered tools. This application leverages modern web development technologies, including Ruby on Rails for backend functionality and Vue.js for an interactive frontend.

## Features

- Create, edit, and manage journal entries.
- AI-powered assistance for generating content and enhancing existing entries.
- Responsive, user-friendly design for seamless interaction.
- Secure user authentication and data management.

## Requirements

Ensure the following are installed on your system before running the application:

- **Ruby**: Version specified in `.ruby-version`
- **Rails**: ~6.1
- **Node.js**: ~14.x or higher
- **Yarn**: Package manager for Node.js dependencies
- **PostgreSQL**: As the database

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone [repository_url]
   cd ai_journal
   ```

2. **Install Dependencies**:
   - Install Ruby dependencies:
     ```bash
     bundle install
     ```
   - Install Node.js dependencies:
     ```bash
     yarn install
     ```

3. **Setup the Database**:
   - Create and migrate the database:
     ```bash
     rails db:create db:migrate
     ```

4. **Run the Application**:
   - Start the Rails server:
     ```bash
     rails server
     ```
   - Visit the application at [http://localhost:3000](http://localhost:3000).

5. **Run Tests**:
   - Run Rails tests:
     ```bash
     rake test
     ```
   - Run JavaScript tests:
     ```bash
     yarn test
     ```

## Development Tools

- **Frontend Framework**: Vue.js
- **Backend Framework**: Ruby on Rails
- **Database**: PostgreSQL
- **Testing**: Minitest (Rails) and Vitest (JavaScript)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch and create a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).