# frozen_string_literal: true

Rails.application.routes.draw do
  resources :comments do
    collection do
      get 'create_empty_record'
    end
  end
  resources :articles do
    collection do
      get 'create_empty_record'
      get 'article_table'
      get 'delete_ajax'
      post 'add_image'
      get 'edit_picture'
      post 'update_image_order'
      get 'article_preferences'
      # put "article_preferences"
    end
  end

  match '/site/article_list' => 'site#article_list', via: :get
  match '/site/article_detail' => 'site#article_detail', via: :get
  match '/site/update_article_partial' => 'site#update_article_partial', via: :get

  # match ':article_name(.:format)', :controller => 'site', :action => 'article_detail',  via: [:get]
end
