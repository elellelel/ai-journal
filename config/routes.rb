Rails.application.routes.draw do
  devise_for :users
  root 'home#index'

  resources :users, only: [:show] do
    resources :entries  
    resources :entry_ids, only: [:index]
  end
  
  resources :chats, only: [:create]
end
