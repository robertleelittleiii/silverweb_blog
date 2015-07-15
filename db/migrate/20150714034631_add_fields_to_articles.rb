class AddFieldsToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :publish_date, :date
    add_column :articles, :show_image, :boolean
  end
end
