module ArticlesHelper
  
  def get_article_name
    out=""
    if not @category_id.blank?
      puts("Category selected for get_article_name")
      out << @category_id
    else
      puts("Article.name selected for get_article_name")

      out << @article.name rescue @article_name rescue ""
    end
    puts("out: #{out}")

    return out
  end
  
  def get_article_title
    if not @article_name.blank? then
      return @article_name
    else
      if @article.blank? then
        return ""
      else
        return  @article.title rescue "Article Title not Found"
      end
    end
  end
  
  def get_article_style_sheet
    if @article.blank? then
        return ""
      else
        return  stylesheet_link_tag @article.article_style  rescue ""
      end
  end
  
  def article_info(article)
    returnval = "<div id=\"attr-articles\" class=\"hidden-item\">"
    returnval << "<div id=\"article-id\">"+(article.id.to_s rescue "-1")+"</div>"
    
    returnval=returnval + "</div>"
    return returnval.html_safe
 
  end
  
  def article_attr_display(article)
    returnval=""
    returnval << "<div id=\"attr-articles\" class=\"hidden-item\">"
    returnval << "<div id=\"article-id\">"+(article.id.to_s rescue "n/a")+"</div>"
    returnval << "</div>"
    return returnval.html_safe
 
  end
  
  def article_edit_div(article, div_id="")
    returnval=""
    begin
      if session[:user_id] then
        user=User.find(session[:user_id])
        if user.roles.detect{|role|((role.name=="Admin") | (role.name=="Site Owner"))} then
          returnval = "<div id=\""+ (div_id=="" ? "edit-articles" : div_id) + "\" >"
          returnval << "<div id='article-id' class='hidden-item'>#{article.id}</div>"
          returnval << image_tag("interface/edit.png",:border=>"0", :class=>"imagebutton", :title => "Edit this Article") # link_to(image_tag("interface/edit.png",:border=>"0", :class=>"imagebutton", :title => "Edit this Article"),:controller => 'articles', :id =>article.id ,  :action => 'edit')
          returnval << "</div>"
        end
      end
    rescue
    end
    return returnval.html_safe

  end
  
  def author_full_info(article)
    mail_to(article.user.name, article.author)
  end
  
end
