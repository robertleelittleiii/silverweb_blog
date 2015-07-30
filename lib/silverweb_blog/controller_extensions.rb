module SilverwebBlog
  module ControllerExtensions
  
    module SiteControllerExtensions
    
      def self.included(base)
        base.send(:include, InstanceMethods)
        # base.alias_method_chain :new, :my_module
      end

      module InstanceMethods
        
        def article_list
          session[:mainnav_status] = false
          session[:last_catetory] = request.env['REQUEST_URI']
          @article_name=Menu.find(session[:parent_menu_id]).name || params[:category_id] rescue ""
    
          @articles_per_article = Settings.articles_per_article.to_i || 8
          @category_id = params[:category_id] || ""
          @department_id = params[:department_id] || ""
          @category_children = params[:category_children] || false
          @get_first_submenu = params[:get_first_sub] || false
          @the_article = params[:article] || "1"
    
          @menu = Menu.where(:name=>@category_id).first 
  
          if params[:top_menu] then
            #puts("top_menu id: #{@menu.menus[0].name}")
            session[:parent_menu_id] = @menu.id rescue 0
            @menu = @menu.menus[0] rescue Menu.new
            @category_id = @menu.name rescue "n/a"

          end
      
          @article_name= Menu.find(session[:parent_menu_id]).name rescue ""
          @articles_list = Article.where(:status=>"published")
          # begin 
          #      if @category_children == "true" then
          #        @categories =  create_menu_lowest_child_list(@category_id, nil,false) + [@category_id]
          #        puts("categories: #{@categories.inspect} ")
          #        @articles_list = Article.where(:article_active=>true)
          #
          #      else
          #        if @category_id.blank? or @department_id.blank? then
          #          @articles_list = Article.where(:article_active=>true)
          #        else
          #          @articles_list = Article.where(:article_active=>true).tagged_with(@category_id, :on=>:category).tagged_with(@department_id, :on=>:department)
          #        end
          #      end
          #    rescue
          #      @articles_list = Article.all
          #    end
    
          @article_ids = @articles_list.collect{|prod| prod.id }

          puts("@article_ids --> #{@articles_list.inspect }")
    
          @action_name = params[:layout_format].blank? ? "article_list" : "article_list_" + params[:layout_format]
         
          @style_sheet_custom = params[:layout_format].blank? ? "" : "article_list_" + params[:layout_format]
         
          @article_count = @articles_list.length

          # @articles = Kaminari.paginate_array(@articles).article(params[:article]).per(@articles_per_article)
          @articles = Article.where(:id=>@article_ids).order("publish_date ASC").order("created_at DESC").page(params[:page]).per(@articles_per_article)
          #    @articles = @articles.article(params[:article]).per(@articles_per_article)

          @article_first = params[:article].blank? ? "1" : (params[:article].to_i*@articles_per_article - (@articles_per_article-1))
    
          @article_last = params[:article].blank? ? @articles.length : ((params[:article].to_i*@articles_per_article) - @articles_per_article) + @articles.length || @articles.length



          respond_to do |format|
            format.html { render action: @action_name }
            format.xml  { render :xml => @articles }
          end
        end
        
        def show_articles
         session[:mainnav_status] = false
          session[:last_catetory] = request.env['REQUEST_URI']
          @article_name=Menu.find(session[:parent_menu_id]).name || params[:category_id] rescue ""
    
          @articles_per_article = Settings.articles_per_article.to_i || 8
          @category_id = params[:category_id] || ""
          @department_id = params[:department_id] || ""
          @category_children = params[:category_children] || false
          @get_first_submenu = params[:get_first_sub] || false
          @the_article = params[:article] || "1"
    
          @menu = Menu.where(:name=>@category_id).first 
  
          if params[:top_menu] then
            #puts("top_menu id: #{@menu.menus[0].name}")
            session[:parent_menu_id] = @menu.id rescue 0
            @menu = @menu.menus[0] rescue Menu.new
            @category_id = @menu.name rescue "n/a"

          end
      
          @article_name= Menu.find(session[:parent_menu_id]).name rescue ""
          @articles_list = Article.where(:article_active=>true)
          # begin 
          #      if @category_children == "true" then
          #        @categories =  create_menu_lowest_child_list(@category_id, nil,false) + [@category_id]
          #        puts("categories: #{@categories.inspect} ")
          #        @articles_list = Article.where(:article_active=>true)
          #
          #      else
          #        if @category_id.blank? or @department_id.blank? then
          #          @articles_list = Article.where(:article_active=>true)
          #        else
          #          @articles_list = Article.where(:article_active=>true).tagged_with(@category_id, :on=>:category).tagged_with(@department_id, :on=>:department)
          #        end
          #      end
          #    rescue
          #      @articles_list = Article.all
          #    end
    
          @article_ids = @articles_list.collect{|prod| prod.id }

          puts("@article_ids --> #{@articles_list.inspect }")
    
    
          @article_count = @articles_list.length

          # @articles = Kaminari.paginate_array(@articles).article(params[:article]).per(@articles_per_article)
          @articles = Article.where(:id=>@article_ids).order("position ASC").order("created_at DESC").article(params[:article]).per(@articles_per_article)
          #    @articles = @articles.article(params[:article]).per(@articles_per_article)

          @article_first = params[:article].blank? ? "1" : (params[:article].to_i*@articles_per_article - (@articles_per_article-1))
    
          @article_last = params[:article].blank? ? @articles.length : ((params[:article].to_i*@articles_per_article) - @articles_per_article) + @articles.length || @articles.length



          respond_to do |format|
            format.html # show.html.erb
            format.xml  { render :xml => @articles }
          end
        end
  
        def update_article_partial
          @article = Article.find(params[:id])
          
          render :partial=>"article_item.html"
          
        end
        
  
  
        def article_detail

         
          session[:mainnav_status] = false
          if params[:id].blank? then
            @article = Article.first
          else
            @article = Article.find(params[:id]) 
          end
                    
          if params[:next] then
            @article = @article.next_in_article
            puts "=======NEXT========"
          end
    
          if params[:prev] then
            @article = @article.previous_in_article
            puts "=======PREV======="

          end
          @menu_id= session[:parent_menu_id] || 0
          @menu = Menu.find(@menu_id) rescue Menu.all[0]
    
          # session[:parent_menu_id] = 0
    
          @collection_article_list = Article.all()
          #@pictures = @article.pictures.where(:active_flag=>true)

          #@articles = @article.where(:article_active=>true).order(:position)
      

    
          respond_to do |format|
#            if @article.action_viewer != "article_detail" then
#              redirect_to :action => @article.action_viewer, :params=>params 
#              return
#            else
              format.html #{ render :action=>@article_template} # show.html.erb
              format.xml  { render :xml => @article }
#            end
          
          end
    
        end
  
        
      end
    
    end
  
  


  end

end