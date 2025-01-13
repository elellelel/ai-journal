class OpenaiService
  def self.generate_response(prompt)
    client = OpenAI::Client.new
    response = client.chat(
      parameters: {
        model: "gpt-4",
        messages: [
          { role: "system", content: "I am building a web application for analyzing large amounts of content." },
          { role: "user", content: prompt }
        ]
      }
    )
    response["choices"].first["message"]["content"]
  end
end