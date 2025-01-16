FactoryBot.define do 
	factory :entry do 
		user
		title { "Example Entry" }
		content { "Example content" }
	end
end