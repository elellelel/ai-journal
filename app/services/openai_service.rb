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

    r = JSON.parse(response)
    r = r["choices"].first
    r = r["message"]["content"]

    format_response(r)
  end

  private

  def self.format_response(response)
    paragraphs = response.split("\n").reject(&:blank?)
    response = paragraphs.map { |p| "<p>#{p.strip}</p>" }.join
  end
end
