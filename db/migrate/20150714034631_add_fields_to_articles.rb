# frozen_string_literal: true

class AddFieldsToArticles < ActiveRecord::Migration[5.0]
  def change
    add_column :articles, :publish_date, :date
    add_column :articles, :show_image, :boolean
  end
end
