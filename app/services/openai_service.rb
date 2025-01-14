class OpenaiService
  def self.generate_response(prompt)
    client = OpenAI::Client.new
    response = client.chat(
      parameters: {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a journaling assistant." },
          { role: "user", content: prompt }
        ]
      }
    )
    response["choices"].first["message"]["content"]
  end
end