class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.text :body
      t.string :email
      t.string :name
      t.string :web_site
      t.references :user, index: true, foreign_key: true
      t.string :status
      t.references :article, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
