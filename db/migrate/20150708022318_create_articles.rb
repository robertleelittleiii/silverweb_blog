# frozen_string_literal: true

class CreateArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :body
      t.string :status
      t.references :user, index: true, foreign_key: true, as: :author

      t.timestamps null: false
    end
  end
end
