# frozen_string_literal: true

module ArticlesHelper
  def get_article_name
    out = ''
    if !@category_id.blank?
      puts('Category selected for get_article_name')
      out << @category_id
    else
      puts('Article.name selected for get_article_name')

      begin
        begin
                out << @article.name
        rescue StandardError
          @article_name
              end
      rescue StandardError
        ''
      end
    end
    puts("out: #{out}")

    out
  end

  def get_article_title
    if !@article_name.blank?
      @article_name
    else
      if @article.blank?
        ''
      else
        begin
          return @article.title
        rescue StandardError
          'Article Title not Found'
        end
      end
    end
  end

  def get_article_style_sheet
    if @article.blank?
      ''
    else
      begin
        return stylesheet_link_tag @article.article_style
      rescue StandardError
        ''
      end
      end
  end

  def article_info(article)
    returnval = '<div id="attr-articles" class="hidden-item">'
    returnval << '<div id="article-id">' + (begin
                                              article.id.to_s
                                            rescue StandardError
                                              '-1'
                                            end) + '</div>'

    returnval += '</div>'
    returnval.html_safe
  end

  def article_attr_display(article)
    returnval = ''
    returnval << '<div id="attr-articles" class="hidden-item">'
    returnval << '<div id="article-id">' + (begin
                                              article.id.to_s
                                            rescue StandardError
                                              'n/a'
                                            end) + '</div>'
    returnval << '</div>'
    returnval.html_safe
  end

  def article_edit_div(article, div_id = '')
    returnval = ''
    begin
      if session[:user_id]
        user = User.find(session[:user_id])
        if user.roles.detect { |role| ((role.name == 'Admin') | (role.name == 'Site Owner')) }
          returnval = '<div id="' + (div_id == '' ? 'edit-articles' : div_id) + '" >'
          returnval << "<div id='article-id' class='hidden-item'>#{article.id}</div>"
          returnval << image_tag('interface/edit.png', border: '0', class: 'imagebutton', title: 'Edit this Article') # link_to(image_tag("interface/edit.png",:border=>"0", :class=>"imagebutton", :title => "Edit this Article"),:controller => 'articles', :id =>article.id ,  :action => 'edit')
          returnval << '</div>'
        end
      end
    rescue StandardError
    end
    returnval.html_safe
  end

  def author_full_info(article)
    mail_to(article.user.name, article.author)
  end

  def get_share_code
    if !Settings.blog_javascript_social_share.blank?
      (CGI.unescapeHTML(Settings.blog_javascript_social_share) + CGI.unescapeHTML(Settings.blog_button_block_social_share)).html_safe
      #+ Settings.blog_button_block_social_share.html_safe
    else
      ''
    end
  end
end
