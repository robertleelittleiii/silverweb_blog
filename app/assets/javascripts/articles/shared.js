/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

article_edit_dialog = "";

function articleeditClickBinding(selector) {
    // selectors .edit-article-item, tr.article-row 

    $(selector).unbind("click").one("click", function (event) {
        event.stopPropagation();
        console.log($(this).find('#article-id').text());
        var article_id = $(this).find('#article-id').text();
        var is_iframe = $("application-space").length > 0

        var url = '/articles/' + article_id + '/edit?request_type=window&window_type=iframe&as_window=true';

        // $(this).effect("highlight", {color: "#669966"}, 1000);

        $.ajax({
            url: url,
            success: function (data)
            {
                article_edit_dialog = createAppDialog(data, "edit-article", {}, "");
                article_edit_dialog.dialog({
                    close: function (event, ui) {
                        if ($("table#article-table").length > 0)
                            articleTableAjax.fnDraw();
                        
                        if ($("div#edit-article").length > 0)
                        {
                         current_article_id = $("div#article div#attr-articles div#article-id").text();
                            if (article_id === current_article_id)
                            {
                                show_article(article_id);
                            }
                        }
                        tinyMCE.editors[0].destroy();
                        $('#edit-article').html("");
                        $('#edit-article').dialog("destroy");
                        articleeditClickBinding("div#edit-articles");

                    }
                });
                
                require("articles/edit.js");
                requireCss("articles/edit.css");
                requireCss("articles.css");

                articles_edit_callDocumentReady();
                article_edit_dialog.dialog('open');


            }
        });




//        if (is_iframe) {
//                        $('iframe#articles-app-id',window.parent.document).attr("src",url);
//                        articleeditClickBinding(this);
//        }
//        else
//            {
//                window.location = url;
//
//            }

    });
}

