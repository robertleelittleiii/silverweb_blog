# frozen_string_literal: true

module SilverwebBlog
  module Config
    @ARTICLE_TYPES = nil
    @ARTICLE_LIST_LAYOUTS = nil

    def self.ARTICLE_TYPES
      @ARTICLE_TYPES
  end

    def self.load_article_types
      @ARTICLE_TYPES = [['Default', ''], ['Custom', 1], ['Article Group', 2]]
    end

    def self.add_article_types(article_type_item)
      @ARTICLE_TYPES << article_type_item
    end

    def self.ARTICLE_LIST_LAYOUTS
      @ARTICLE_LIST_LAYOUTS
    end

    def self.load_article_layout_types
      @ARTICLE_LIST_LAYOUTS = [['Default', ''], ['Square Block', 1], ['Regtangle Block', 2], ['Article List', 3]]
    end

    def self.add_article_layout_types(article_layout_type_item)
      @ARTICLE_LIST_LAYOUTS << article_layout_type_item
    end
  end
end

SilverwebBlog::Config.load_article_types
SilverwebBlog::Config.load_article_layout_types
