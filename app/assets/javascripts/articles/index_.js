
var articleTableAjax = "";
var articles_index_callDocumentReady_called = false;
var articlePrefsDialog = "";

$(document).ready(function () {
    if (!articles_index_callDocumentReady_called)
    {
        articles_index_callDocumentReady_called = true;
        if ($("#as_window").text() == "true")
        {
            //  alert("it is a window");
        }
        else
        {
            articles_index_callDocumentReady();
        }
    }
});


function articles_index_callDocumentReady() {
    requireCss("tables.css");
    require("articles/shared.js");

    if ($('#mainnav:visible').length != 0)
    {
        $("div#article-middle-left").hide();
        $("div#content").width("100%");
        $('#Content').css('background', "white")
    }

    //  Required scripts (loaded for this js file)
    //

    // reateArticleDialog();
    //    $("body").css("cursor", "progress");[
    //    articleTableOld=$('#article-table-old').dataTable({
    //        "aLengthMenu": [[-1, 10, 25, 50], ["All", 10, 25, 50]]
    //    });
    $("body").css("cursor", "progress");

    createArticleTable();

    $("body").css("cursor", "default");

    //
    //    $('#article-table .article-row').bind('click', function(){
    //        $(this).addClass('row_selected');
    //        articleID=$(this).find("#article-id").text().strip();
    //        window.location = "/article/edit/"+articleID;
    //    });

    //    $('.delete-article-item').bind('ajax:success', function(xhr, data, status){
    //        $("body").css("cursor", "progress");[
    //        theTarget=this.parentNode.parentNode;
    //        var aPos = articleTableAjax.fnGetPosition( theTarget );
    //        articleTableAjax.fnDeleteRow(aPos);
    //        articleTableAjax.fnDraw();
    //        $("body").css("cursor", "default");[]
    //    });

    //    $('.delete-article-item').bind('ajax:error', function(xhr, data, error){
    //        alert("Error:" + JSON.parse(data.responseText)["error"]);
    //        $("body").css("cursor", "default");[]
    //
    //    });

    $(".edit_article").bind('ajax:success', function (xhr, data, status) {
        $('#edit-password-dialog').dialog('close');
    });

//    $('a#new-article').unbind().bind('ajax:beforeSend', function (e, xhr, settings) {
//        xhr.setRequestHeader('accept', '*/*;q=0.5, text/html, ' + settings.accepts.html);
//        $("body").css("cursor", "progress");
//    });
//
//    $('a#new-article').bind('ajax:success', function (xhr, data, status) {
//        $("body").css("cursor", "default");
//        articleTableAjax.fnDraw();
//        setUpPurrNotifier("Notice", "New Article Created!'");
//    });


    // createPasswordDialog();
    // createArticleDialog();
    bindNewArticle();

    $("a.button-link").button();
    bindPreferences();
}



function deleteArticle(article_id)
{
    var answer = confirm('Are you sure you want to delete this?')
    if (answer) {
        $.ajax({
            url: '/articles/delete_ajax?id=' + article_id,
            success: function (data)
            {
                setUpPurrNotifier("Notice", "Item Successfully Deleted.");
                articleTableAjax.fnDraw();

            }
        });

    }
}

function editArticle(article_id)
{
    var url = '/articles/' + article_id + '/edit?request_type=window&window_type=iframe';
    $('iframe#articles-app-id', window.parent.document).attr("src", url);
}





function loadArticleScreen() {

    article - action - area
}


function createArticleDialog() {

    $('#edit-article-dialog').dialog({
        autoOpen: false,
        width: 455,
        height: 625,
        modal: true,
        buttons: {
            "Delete": function () {
                article_id = $(".m-content div#article-id").text().trim();
                if (confirm("Are you sure you want to delete this article?"))

                {
                    $(this).dialog("close");

                    $.ajax({
                        url: '/articles/delete_ajax?id=' + article_id,
                        success: function (data)
                        {
                            articleTableAjax.fnDraw();
                        }
                    });
                }
                else
                {

                }
            },
            "Ok": function () {
                $(this).dialog("close");
                articleTableAjax.fnDraw();
            }
        }

    });
}



function createArticleTable() {
    console.log("create table");
    articleTableAjax = $('#article-table').dataTable({
        "iDisplayLength": 25,
        "aLengthMenu": [[25, 50, 100], [25, 50, 100]],
        "bStateSave": true,
        "fnStateSave": function (oSettings, oData) {
            localStorage.setItem('DataTables_articles_' + window.location.pathname, JSON.stringify(oData));
        },
        "fnStateLoad": function (oSettings) {
            return JSON.parse(localStorage.getItem('DataTables_articles_' + window.location.pathname));
        },
        "bProcessing": true,
        "bServerSide": true,
        "aaSorting": [[1, "asc"]],
        "sAjaxSource": "/articles/article_table",
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $(nRow).addClass('article-row');
            $(nRow).addClass('gradeA');
            return nRow;
        },
        "fnInitComplete": function () {
            // $(".best_in_place").best_in_place(); 

        },
        "fnDrawCallback": function () {
            $(".best_in_place").best_in_place();
            //articleeditClickBinding(".edit-article-item");
            articleeditClickBinding("tr.article-row");
            bindDeleteArticle();
        }
    });
}

function bindNewArticle() {

    $('a#new-article').unbind().bind('ajax:beforeSend', function (e, xhr, settings) {
        xhr.setRequestHeader('accept', '*/*;q=0.5, text/html, ' + settings.accepts.html);
        $("body").css("cursor", "progress");
    }).bind('ajax:success', function (xhr, data, status) {
        $("body").css("cursor", "default");
        articleTableAjax.fnDraw();
        setUpPurrNotifier("Notice", "New Article Created!'");
    }).bind('ajax:error', function (evt, xhr, status, error) {
        setUpPurrNotifier("Error", "Article Creation Failed!'");
    });

//    $('a#new-article').bind('ajax:beforeSend', function (evt, xhr, settings) {
//        // alert("ajax:before");  
//        console.log('ajax:before');
//        console.log(evt);
//        console.log(xhr);
//        console.log(settings);
//
//        $("body").css("cursor", "progress");
//
//
//
//    }).bind('ajax:success', function (evt, data, status, xhr) {
//        //  alert("ajax:success"); 
//        console.log('ajax:success');
//        console.log(evt);
//        console.log("date:" + data + ":");
//
//        $("body").css("cursor", "progress");
//        console.log(data.id);
//        editArticle(data.id);
//
//        console.log(status);
//        console.log(xhr);
//
//    }).bind('ajax:error', function (evt, xhr, status, error) {
//        // alert("ajax:failure"); 
//        console.log('ajax:error');
//        console.log(evt);
//        console.log(xhr);
//        console.log(status);
//        console.log(error);
//
//        alert("Error:" + JSON.parse(data.responseText)["error"]);
//        $("body").css("cursor", "default");
//
//
//    }).bind('ajax:complete', function (evt, xhr, status) {
//        //    alert("ajax:complete");  
//        console.log('ajax:complete');
//        console.log(evt);
//        console.log(xhr);
//        // console.log(status);
//        $("body").css("cursor", "default");
//
//
//    });

}
function bindDeleteArticle() {
    $(".delete-article-item").on("click", function (e) {

        // console.log($(this).parent().parent().parent().find('#article-id').text());
        var article_id = $(this).parent().parent().parent().find('#article-id').text();
        deleteArticle(article_id);
        return false;
    });
}








// ************************************    
//
// Create Edit Dialog Box
//
// ************************************    
//
//function createAppDialog(theContent) {
//    
//        
//    if ($("#app-dialog").length == 0) 
//    {    
//        var dialogContainer =  "<div id='app-dialog'></div>";
//        $("#article").append($(dialogContainer));
//    }
//    else 
//    {
//        dialogContainer=$("#app-dialog");   
//    }
//    // $('#app-dialog').html(theContent);
//    theContent = '<input type="hidden" autofocus="autofocus" />' + theContent
//    theAppDialog =  $('#app-dialog').dialog({
//        autoOpen: false,
//        modal: true,
//        buttons: {
//            "Close": function() { 
//                // Do what needs to be done to complete 
//                $(this).dialog("close"); 
//            }
//        },
//        close: function( event, ui ) {
//            $('#app-dialog').html("");
//            $('#app-dialog').dialog( "destroy" );
//        },
//        open: function (event, ui)
//        {
//            popUpAlertifExists();
//        }
//        
//        
//    });
//    
//    $('#app-dialog').html(theContent);
//
//    theHeight= $('#app-dialog #dialog-height').text() || "500";
//    theWidth= $('#app-dialog #dialog-width').text()  || "500";
//    theTitle= $('#app-dialog #dialog-name').text() || "Edit";
//    
//    theAppDialog.dialog({
//        title:theTitle,
//        width: theWidth,
//        height:theHeight
//    });
//        
//    return(theAppDialog)
//}

function edit_article_dialog(data) {

    // alert("ajax:success");
    article_edit_dialog = createAppDialog(data, "edit-article", {}, "");

    //initialize_save_button();
    //$('.datepicker').datepicker();
    //tiny_mce_initializer();
    //bind_org_select();
    //bind_membership_select();
    //bind_grade_select();
    //bind_flags_select();

    //bind_grade_all_select();

    //bind_grade_filter_display();
    //bind_membership_filter_display();
    //bind_flags_filter_display();
    //bind_select_ajax("picture_priority");
    //bind_select_ajax("picture_status");



    //current_notice = $("#picture-id").text();
    //set_before_edit(current_notice);
    // tinyMCE.init({"selector":"textarea.tinymce"});
    // $(".best_in_place").best_in_place();

    //bind_file_upload_to_upload_form();
    //$("button.ui-dialog-titlebar-close").hide();

    //initialize_add_organization();
    //select_subject_field();
    //initialize_select_all_button();
    //initialize_select_none_button();
    //initilize_filter_buttons();

}

$(document).off('focusin').on('focusin', function (e) {
    if ($(event.target).closest(".mce-window").length) {
        e.stopImmediatePropagation();
    }
});


function bindPreferences() {

    $('a#article-prefs').unbind().bind('ajax:beforeSend', function (e, xhr, settings) {
        xhr.setRequestHeader('accept', '*/*;q=0.5, text/html, ' + settings.accepts.html);
        $("body").css("cursor", "progress");
    }).bind('ajax:success', function (xhr, data, status) {
        $("body").css("cursor", "default");
        articlePrefsDialog = createAppDialog(data, "article-prefs-dialog");
        articlePrefsDialog.dialog('open');
        articlePrefsDialog.dialog({
            close: function (event, ui) {
                articlePrefsDialog.html("");
                articlePrefsDialog.dialog("destroy");
            }
        });
        require("articles/article_preferences.js");
        article_preferences_callDocumentReady();

        //update_rolls_callDocumentReady();


        // setupRolesSelection();
        // 
    }).bind('ajax:error', function (evt, xhr, status, error) {
        setUpPurrNotifier("Error", "Prefs could not be opened!'");
    });


}