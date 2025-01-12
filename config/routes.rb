Rails.application.routes.draw do
  devise_for :users
  resources :entries
  root 'entries#index'
end
