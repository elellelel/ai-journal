Rails.application.routes.draw do
  devise_for :users
  resources :entries
  root 'entries#index'

  resources :chats, only: [:create]
end
