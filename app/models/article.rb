# frozen_string_literal: true

class Article < ActiveRecord::Base
  belongs_to :user
  has_many :comments
  has_many :pictures, -> { order(:position) }, dependent: :destroy, as: :resource

  acts_as_taggable_on :security_group
  acts_as_taggable_on :blog_category

  versioned only: %i[title body]

  def name
    #   return_name =   self.menu.nil? ? self.title : self.menu.name
    return_name = title
    return_name
  end

  def page_url
    #    return_url = Menu.where(page_id: id, m_type: ["1","5"]).first.menu_url rescue "/#{title rescue "n/a"}"
    #    return_url = "/#{title rescue "n/a"}" if return_url==""
    return_url = url_for(controller: :site, action: :show_article, id: id, only_path: true)
    return_url
  end

  def author
    user.full_name + '(' + user.name + ')'
  end
end
