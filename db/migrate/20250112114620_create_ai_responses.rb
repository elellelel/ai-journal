class CreateAiResponses < ActiveRecord::Migration[8.0]
  def change
    create_table :ai_responses do |t|
      t.text :content
      t.references :entry, null: false, foreign_key: true

      t.timestamps
    end
  end
end
