# frozen_string_literal: true

module SilverwebBlog
  class Railtie < Rails::Railtie
    #    initializer "silverweb_article.action_controller" do
    #      ActiveSupport.on_load(:action_controller) do
    #        puts "Extending #{self} with silverweb_article"
    #        # ActionController::Base gets a method that allows controllers to include the new behavior
    #        include SilverwebBlog::ControllerExtensions # ActiveSupport::Concern
    #        config.to_prepare do
    #      SiteController.send(:include, SilverwebBlog::ControllerExtensions::SiteControllerExtensions)
    #    end
    #      end
    #    end

    # The block you pass to this method will run for every request in
    # development mode, but only once in production.

    initializer 'silverweb_article.update_picture_model' do
      SilverwebCms::Config.add_nav_item(name: 'Articles', controller: 'articles', action: 'index')

      SilverwebCms::Config.add_menu_class(['List Articles', 'menu_show_articles'])

      SilverwebCms::Config.add_route_item(match: '/blog/:article_name', controller: 'site', action: 'article_detail', via: :get)
      #        SilverwebCms::Config.add_route_item({:match=>":article_name(.:format)", :controller=>'site', :action=>'article_detail', :via=>:get})

      #  SilverwebCms::Config.add_menu_class(["Show Artifact Group","menu_show_article_group"])

      #  SilverwebCms::Config.add_menu_actions(["Show Article",20])

      #
      # Add relationships to CMS models
      #

      Picture.class_eval do
        belongs_to :articles, polymorphic: true
      end

      User.class_eval do
        has_many :articles
        has_many :comments
      end

      ImageUploader.class_eval do
        version :article_slider do
          process resize_to_fill: [885, 600]
        end

        version :article_custom_slider do
          process resize_to_limit: [600, 615]
        end

        version :article_before do
          process resize_to_limit: [375, 255]
        end

        version :article_list do
          process resize_to_fill: [180, 130]
        end
      end
    end

    #    initializer "silverweb_article.update_menu_defs" do
    #      MenusController::MENU_TYPES << ["Article",6]
    #      MenusController::ACTION_TYPES << ["Show Article",20]
    #    end

    config.to_prepare do
      SiteController.send(:include, SilverwebBlog::ControllerExtensions::SiteControllerExtensions)
    end
  end
end
