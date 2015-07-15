class ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :edit, :update, :destroy]

  
    STATUS_TYPES = [["Draft","draft"],["Published","published"],["Future","future"],["Pending","pending"], ["Private","private"],["Deleted","deleted"] ]

  # GET /articles
  def index
    @articles = Article.all
  end

  # GET /articles/1
  def show
  end

  # GET /articles/new
  def new
    @article = Article.new
  end

  # GET /articles/1/edit
  def edit
    session[:current_article] = params[:id]
    @status_types = STATUS_TYPES

    @article.revert_to(params[:version].to_i) if params[:version]

      respond_to do |format|
      format.html 
      format.json  { render :json => @article, :status => :created, :location => @article }
    end
  end

  # POST /articles
  def create
    @article = Article.new(article_params)

    if @article.save
      redirect_to @article, notice: 'Article was successfully created.'
    else
      render :new
    end
  end
  
    # POST create_empty_record/articles

    def create_empty_record
    @article = Article.new
    @article.title="New Article"
    @article.body="Edit Me"
    @article.user_id = session[:user_id]
    @article.status = "draft"
    @article.save
      redirect_to action: :edit, id: @article.id, notice: 'Article was successfully created.'
  end

  # PATCH/PUT /articles/1
# def update
#    if @article.update(article_params)
#      redirect_to @article, notice: 'Article was successfully updated.'
#    else
#      render :edit
#    end
#  end             

   def update
    respond_to do |format|
      if @article.update(article_params)
        format.html { redirect_to(:action =>"edit", :notice => 'Article was successfully updated.') }
        format.json { render :json=> {:notice => 'Article was successfully updated.'} }
      else
        format.html { render :action => "edit" }
        format.json  { render :json => @article.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /articles/1
  def destroy
    @article.destroy
    redirect_to articles_url, notice: 'Article was successfully destroyed.'
  end

def article_table
    @objects = current_objects(params)
    @total_objects = total_objects(params)
    render :layout => false
  end
  
 
  def delete_ajax
      @article = Article.find(params[:id])
    
      @article.destroy
      render :nothing=>true
    end
    
  def custom
      @article = Article.find(session[:current_article])
    
     respond_to do |format|
      format.css 
    end
  end
  
  
  def link_list
    @articles = Article.order(:title)
    @pdfs = TinyPrint.where("image_file_name like '%.pdf'") rescue []
    @last_pdf = @pdfs.last rescue ""
    @last_article = @articles.last
  end
  
  
  def add_image
    @article = Article.find(params[:id])
    format = params[:format]
    image=params[:image]
    if image.size > 0
      @picture = Picture.new(:image=>image)
      @picture.position=999
      image_saved = @picture.save
      @article.pictures<< @picture
    end
  
    respond_to do |format|
      if image_saved
        format.js   { render :action=>"../pictures/create.js" }
        format.html { redirect_to @picture, :notice=>"Picture was successfully created." }
        format.json { render :json=>@picture, :status=>:created, :location=>@picture }
      else
        format.html { render :action=>"new" }
        format.json { render :json=>@picture.errors, :status=>:unprocessable_entry }
      end
    end
  end
    
  def delete_image
    @article = Article.find(params[:incoming_id])
    @image = Picture.find(params[:id])
    @image.destroy
    
    #  respond_to do |format|  
    #          format.html { render :nothing => true }
    #          format.js   { render :nothing => true }  
    #  end  

    
    respond_to do |format|
      format.js if request.xhr?
      format.html {redirect_to :action => 'show', :id=>params[:menu_id]}
    end
  end


  def destroy_image
    @image = Picture.find(params[:id])
    @image.destroy
    redirect_to :action => 'show', :id => params[:menu_id]
  end
  
  def edit_picture
    @picture = Picture.find(params[:picture_id])
    @image_locations = ["List","Primary", "-"]  
     
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @picture} 
    end
  end
  

  def update_image_order
    params[:picture].each_with_index do |id, position|
      #   Image.update(id, :position => position)
      Picture.reorder(id,position)
    end
    render nothing: true

  end

  
  private

  def current_objects(params={})
    current_article = (params[:iDisplayStart].to_i/params[:iDisplayLength].to_i rescue 0)+1
    @current_objects = Article.page(current_article).per(params[:iDisplayLength]).order("#{datatable_columns(params[:iSortCol_0])} #{params[:sSortDir_0] || "DESC"}").where(conditions(params))
  end
  

  def total_objects(params={})
    @total_objects = Article.where(conditions(params)).count()
  end

  def datatable_columns(column_id)
    puts(column_id)
    case column_id.to_i
    when 0
      return "`articles`.`id`"
    when 1
      return "`articles`.`title`"
    else
      return "`articles`.`body`"
    end
  end

      
  def conditions(params={})
    
    conditions = []
   
    conditions << "(articles.id LIKE '%#{params[:sSearch]}%' OR
       articles.title LIKE '%#{params[:sSearch]}%' OR 
       articles.body LIKE '%#{params[:sSearch]}%')" if(params[:sSearch])
    return conditions.join(" AND ")
    
    
  end
  
  # Use callbacks to share common setup or constraints between actions.
    def set_article
      @article = Article.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def article_params
      params.require(:article).permit(:title, :body, :status, :author, :show_image)
    end
end
