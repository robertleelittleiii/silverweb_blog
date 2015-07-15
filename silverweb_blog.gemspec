$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "silverweb_blog/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "silverweb_blog"
  s.version     = SilverwebBlog::VERSION
s.authors     = ["Robert Lee Little III"]
  s.email       = ["rob@silverwebsystems.com"]
  s.homepage    = "http://www.silverwebsystems.com"
  s.summary     = "Silverweb Blog addon for Silverweb CMS."
  s.description = "This gem will create all nessesary components for a Blog for he Silverweb CMS"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 4.2.0"
  s.add_dependency 'silverweb_cms'

  s.add_development_dependency "mysql"
end
