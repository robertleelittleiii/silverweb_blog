module SilverwebBlog
  require 'silverweb_cms'

  class Engine < ::Rails::Engine
    
    ActiveSupport.on_load(:action_controller) do
      include SilverwebBlog::ControllerExtensions # ActiveSupport::Concern
    end
             
    initializer :append_migrations do |app|
      unless app.root.to_s.match root.to_s
        config.paths["db/migrate"].expanded.each do |expanded_path|
          app.config.paths["db/migrate"] << expanded_path
        end
      end
    end
  end
end
