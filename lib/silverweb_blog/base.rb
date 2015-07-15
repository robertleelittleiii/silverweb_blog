module SilverwebBlog
  module Config
        @ARTICLE_TYPES = nil

    # Accessor used to access plugin configuration settings (returns a Hash that
    # directly corresponds to the contents of <tt>config/vtools_ui.yml</tt>)
    def self.ARTICLE_TYPES
      @ARTICLE_TYPES
    end
    
    def self.load_article_types
      @ARTICLE_TYPES = [["Default",""],["Custom",1], ["Artfiact Group",2]]
    end
    
    def self.add_article_types(article_type_item)
      @ARTICLE_TYPES << article_type_item
    end
  end
  
  
end


SilverwebBlog::Config.load_article_types
