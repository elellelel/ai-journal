class OpenaiService
  def self.generate_response(prompt)
    client = OpenAI::Client.new
    response = client.chat(
      parameters: {
        model: "gpt-4",
        messages: [
          { role: "user", content: prompt }
        ]
      }
    )

    format_response(response["choices"].first["message"]["content"])
  end

  private

  def self.format_response(response)
    paragraphs = response.split("\n").reject(&:blank?)
    response = paragraphs.map { |p| "<p>#{p.strip}</p>" }.join
  end
end
