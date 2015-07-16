/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var global_editor_hold = "";
var tinyMCE_editor_article = "";
var articles_edit_callDocumentReady_called = false;
var slider_edit_dialog = "";
var result_test = "";

$(document).ready(function () {
    if (!articles_edit_callDocumentReady_called)
    {
        articles_edit_callDocumentReady_called = true;
        if ($("#as_window").text() == "true")
        {
            //  alert("it is a window");
        }
        else
        {
            articles_edit_callDocumentReady();
        }
    }
});


function articles_edit_callDocumentReady() {
    $("#article-tabs").tabs({
        activate: function (event, ui) {
            if ($(ui.newTab[0]).find('a').text() == "Live Preview")
            {
                console.log("updated!")
                $('iframe.preview').each(function () {
                    this.contentWindow.location.reload(true)
                });
            }

        }
    });
    loadCustomCSS();
    activate_scroller_sort();
    set_up_delete_slider_callback();
    set_up_add_slider_callback();
    setupCheckboxes(".security-check");
    $(".best_in_place").best_in_place();
    ui_ajax_select();
    $("a.button-link").button();
    
    $('#article_body_save').bind("click", function () {
        // alert("clicked");
        $(this).closest("form").trigger("submit");
        return true;
    });
    sliderEditClickBinding("ul#sliders li");
    tinyMCE_editor_article = tinyMCE.init(tinymce_config);
    //tinyMCE.get("article_body").editor.on('ExecCommand', function(e) {
    //        console.log('ExecCommand event', e);
    //   })

    // setTimeout(function(){bind_file_paste_to_upload_form();},2000); 
    bind_versions_links();
    set_up_save_callback();
// do a quick frame reload to make it work.

    bindPicturesSort();
    bind_mouseover();
    initialize_edit_button();
    activate_buttons();
    
    bindDeleteImage();
    bind_file_upload_to_upload_form();
    requireCss("image_libraries/image_list.css");

}


function activate_scroller_sort() {

    $('#sliders').sortable({
        axis: 'y',
        dropOnEmpty: false,
        handle: '.slider-drag',
        cursor: 'crosshair',
        items: 'li',
        opacity: 0.4,
        scroll: true,
        update: function () {
            article_id = $("div#edit-article #article-id").html().trim();

            $.ajax({
                type: 'post',
                data: $('#sliders').sortable('serialize') + "&article_id=" + article_id,
                dataType: 'script',
                complete: function (request) {
                    $('#sliders').effect('highlight');
                },
                url: '/sliders/sort'
            })
        }
    });
}

function updateSliderList() {

    article_id = $("div#edit-article #article-id").html().trim();
    $.ajax({
        type: 'GET',
        data: 'article_id=' + article_id,
        dataType: 'html',
        success: function (data) {
            $('ul#sliders').html(data);
            activate_scroller_sort();
            set_up_delete_slider_callback();
            $('iframe.preview').attr("src", $('iframe.preview').attr("src"));
            sliderEditClickBinding("ul#sliders li");
        },
        url: '/articles/get_sliders_list'
    });

}
function set_up_add_slider_callback() {

    $("#add-slider")
            .bind("ajax:success", function (event, data, status, xhr) {
                updateSliderList();
            });
}

function set_up_delete_slider_callback() {

    $(".delete_slider")
            .bind('ajax:beforeSend', function (e, xhr, settings) {
                e.stopPropagation();
            }).bind("ajax:success", function (event, data, status, xhr) {
        updateSliderList();
    });

}

function loadCustomCSS() {

    var custom_css = $("#best_in_place_article_template_name").text();
    requireCss("site/show_article-" + custom_css + ".css");
}

// triggered when the save button is clicked in tinemce.

function mysave() {
    console.log("trigger save");
    tinymce.triggerSave();
    // $("#article-body-save").closest("form").trigger("submit");
    $("#article_body").parent().parent().closest("form").trigger("submit");

}

function ajaxSave()
{

    tinyMCE.triggerSave();

    $("#article_body_save").closest("form").trigger("submit");


}

function BestInPlaceCallBack(input) {

    $('iframe.preview').attr("src", $('iframe.preview').attr("src"));
    loadCustomCSS();
}


function tinyMcePostInit(inst) {
    articles_bind_file_paste_to_upload_form();
}

function articles_bind_file_paste_to_upload_form()
{
    $("form#picture-paste-article").fileupload({
        dataType: "json",
        pasteZone: $("iframe#article_body_ifr").contents().find("body"),
        add: function (e, data) {
            file = data.files[0];
            data.context = $(tmpl("template-upload", file));
            // $("div.progress").progressbar();
            // $('#pictures').append(data.context);
            var jqXHR = data.submit()
                    .success(function (result, statusText, jqXHR) {

                        //   console.log("------ - fileupload: Success - -------");
                        //  console.log(result);
                        //   console.log(statusText);
                        //   console.log(jqXHR);

                        //  console.log(JSON.stringify(jqXHR.responseJSON["attachment"]));

                        //  console.log(typeof (jqXHR.responseText));


// specifically for IE8. 
                        if (typeof (jqXHR.responseText) == "undefined") {
                            top.tinymce.activeEditor.undoManager.undo();
                            setUpPurrNotifier("info.png", "Notice", jqXHR.responseJSON["attachment"][0]);
                            data.context.remove();
                        }
                        else
                        {
                            top.tinymce.activeEditor.undoManager.undo();
                            //  console.log(result.image.url)
                            image_tag = "<img src='" + result.image.url + "'/>"
                            top.tinymce.activeEditor.insertContent(image_tag);
                            console.log("success");
                            //  render_pictures();
                        }

                    })
                    .error(function (jqXHR, statusText, errorThrown) {
                        // console.log("------ - fileupload: Error - -------");
                        // console.log(jqXHR.status);
                        // console.log(statusText);
                        // console.log(errorThrown);
                        // console.log(jqXHR.responseText);
                        if (jqXHR.status == "200")
                        {
                            //render_pictures();
                        }
                        else
                        {
                            //var obj = jQuery.parseJSON(jqXHR.responseText);
                            // console.log(typeof obj["attachment"][0])
                            //setUpPurrNotifier("info.png", "Notice", obj["attachment"][0]);
                            // data.context.remove();
                        }
//                        if (jqXHR.statusText == "success") {
//                            render_pictures();
//                            // It succeeded and we need to update the file list.
//                        }
//                        else {
//                            var obj = jQuery.parseJSON(jqXHR.responseText);
//                            setUpPurrNotifier("info.png", "Notice", obj["attachment"][0]);
//                            data.context.remove();
//                        }

                    })
                    .complete(function (result, textStatus, jqXHR) {
                        // console.log("------ - fileupload: Complete - -------");
                        // console.log(result);
                        // console.log(textStatus);
                        // console.log(jqXHR);
                    });
        },
        progress: function (e, data) {
            if (data.context)
            {
                progress = parseInt(data.loaded / data.total * 100, 10);
                data.context.find('.bar').css('width', progress + '%');
            }
        },
        done: function (e, data) {
            // console.log(e);
            // console.log(data);
            //data.context.text('');
        }
    }).bind('fileuploaddone', function (e, data) {
        // console.log(e);
        // console.log(data);
        // data.context.remove();
        //data.context.text('');
    }).bind('fileuploadpaste', function (e, data) {
        /* ... */
        image_tag = "<img src='/assets/interface/ajax-loader-big.gif'/>"
        top.tinymce.activeEditor.undoManager.add();
        top.tinymce.activeEditor.insertContent(image_tag);
        top.tinymce.activeEditor.undoManager.add();

        // assets/interface/ajax-loader.gif
        console.log("paste event.")


    })
}

function bind_download_to_files()
{
    $("div.file-item div#logo-links").unbind("click");
    $("div.file-item div#logo-links").bind("click",
            function () {
                var href = $($(this)[0]).find('a').attr('href');
                window.location.href = href
            });
}


function sliderEditClickBinding(selector) {
    // selectors .edit-article-item, tr.article-row 

    $(selector).unbind("click").one("click", function (e) {
        if (e.target.id === "delete-button")
            return;
        console.log(e.target.id);
        console.log($(this).find('#slider-id').text());
        var slider_id = $(this).find('#slider-id').text();
        var is_iframe = $("application-space").length > 0

        var url = '/sliders/' + slider_id + '/edit?request_type=window&window_type=iframe&as_window=true';

        $(this).effect("highlight", {color: "#669966"}, 1000);

        $.ajax({
            url: url,
            success: function (data)
            {
                $("form#picture-paste-article").fileupload('destroy');
                tinyMCE.EditorManager.execCommand('mceRemoveEditor', true, "article_body");

                slider_edit_dialog = createAppDialog(data, "edit-slider-dialog", {}, "");
                slider_edit_dialog.dialog({
                    close: function (event, ui) {
                        updateSliderList();
                        $('#edit-slider-dialog').html("");
                        $('#edit-slider-dialog').dialog("destroy");
                        tinymce.EditorManager.execCommand('mceAddEditor', true, "article_body");
                        articles_bind_file_paste_to_upload_form();
                    }
                });
                slider_edit_dialog.dialog('open');

                require("sliders/edit.js");
                requireCss("sliders.css");

                sliders_edit_callDocumentReady();
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

function bind_versions_links() {
    $('a.version-info').unbind().bind('ajax:beforeSend', function (e, xhr, settings) {
        $("body").css("cursor", "progress");
    }).bind('ajax:success', function (xhr, data, status) {
        $("body").css("cursor", "default");
        console.log(xhr);
        console.log(data);
        result_test = data;
        console.log(status);

        $("div#best_in_place_article_title").text(data["title"]);
        tinyMCE.activeEditor.setContent(data["body"]);
        console.log(this);
        console.log($(this).text());
        $("a.version-info").each(function (item) {
            $(this).removeClass('selected');
        });
        $(this).addClass('selected');
        $("span#version-number").text($(this).text());

        setUpPurrNotifier("Notice", "Version Loaded!'");
    }).bind('ajax:error', function (evt, xhr, status, error) {
        setUpPurrNotifier("Error", "Version load failed!'");
    });

}

function set_up_save_callback() {

    $("form.edit_article")
            .on("ajax:success", function (event, data, status, xhr) {
                //   console.log(event);
                //   console.log(data["notice"]);
                //  console.log(status);
                //   console.log(xhr);
                setUpPurrNotifier("Attention", data["notice"]);
                $('iframe.preview').attr("src", $('iframe.preview').attr("src"));

            });
}


function bind_file_upload_to_upload_form()
{
    $("form.upload-form").fileupload({
        dataType: "json",
        add: function (e, data) {
            file = data.files[0];
            data.context = $(tmpl("template-upload", file));
            // $("div.progress").progressbar();
            $('#images').fadeIn();
            $('#images').append(data.context);
            var jqXHR = data.submit()
                    .success(function (result, statusText, jqXHR) {

                        // console.log("------ - fileupload: Success - -------");
                        // console.log(result);
                        // console.log(statusText);
                        // console.log(jqXHR);

                        // console.log(JSON.stringify(jqXHR.responseJSON["attachment"]));

                        // console.log(typeof(jqXHR.responseText));
// specifically for IE8. 
                        if (typeof (jqXHR.responseText) == "undefined") {
                            setUpPurrNotifier("info.png", "Notice", jqXHR.responseJSON["attachment"][0]);
                            data.context.remove();
                        }
                        else
                        {
                            render_picture(result.id);



                        }

                    })
                    .error(function (jqXHR, statusText, errorThrown) {
                        console.log("------ - fileupload: Error - -------");
                        console.log(jqXHR.status);
                        console.log(statusText);
                        console.log(errorThrown);
                        console.log(jqXHR.responseText);
                        if (jqXHR.status == "200")
                        {
                            render_picture(result.id);
                        }
                        else
                        {
                            var obj = jQuery.parseJSON(jqXHR.responseText);
                            // console.log(typeof obj["attachment"][0])
                            setUpPurrNotifier("info.png", "Notice", obj["attachment"][0]);
                            data.context.remove();
                        }
//                        if (jqXHR.statusText == "success") {
//                            render_pictures();
//                            // It succeeded and we need to update the file list.
//                        }
//                        else {
//                            var obj = jQuery.parseJSON(jqXHR.responseText);
//                            setUpPurrNotifier("info.png", "Notice", obj["attachment"][0]);
//                            data.context.remove();
//                        }

                    })
                    .complete(function (result, textStatus, jqXHR) {
                        // console.log("------ - fileupload: Complete - -------");
                        // console.log(result);
                        // console.log(textStatus);
                        // console.log(jqXHR);
                    });
        },
        progress: function (e, data) {
            if (data.context)
            {
                progress = parseInt(data.loaded / data.total * 100, 10);
                data.context.find('.bar').css('width', progress + '%');
            }
        },
        done: function (e, data) {
            // console.log(e);
            // console.log(data);
            data.context.text('');
        }
    }).bind('fileuploaddone', function (e, data) {
        // console.log(e);
        // console.log(data);
        data.context.remove();
        //data.context.text('');
    });
}


function bind_download_to_files()
{
    $("div.file-item div#logo-links").unbind("click");
    $("div.file-item div#logo-links").bind("click",
            function () {
                var href = $($(this)[0]).find('a').attr('href');
                window.location.href = href
            });
}

function render_pictures(article_id) {
    $.ajax({
        dataType: "html",
        url: '/pictures/render_pictures',
        cache: false,
        data: "class_name=article&id=" + article_id,
        success: function (data)
        {
            $("div#images").html(data).hide().fadeIn();

            max_images = $('#max-images').text();

            if (max_images.length > 0)
            {
                total_images = $("div.file-list-item").size();
                if (total_images >= max_images) {
                    $("div#imagebutton").fadeOut();
                }

            }
            bind_file_upload_to_upload_form();


        }
    });

}

function render_picture(picture_id) {
    $.ajax({
        dataType: "html",
        url: '/pictures/render_picture',
        cache: false,
        data: "class_name=article&id=" + picture_id,
        success: function (data)
        {
            $("div#images").append(data).hide().fadeIn();

            max_images = $('#max-images').text();

            if (max_images.length > 0)
            {
                total_images = $("div.file-list-item").size();
                if (total_images >= max_images) {
                    $("div#imagebutton").fadeOut();
                }

            }
            
            bind_file_upload_to_upload_form();
            bindDeleteImage();
            bind_mouseover();
            activate_buttons();
            initialize_edit_button();
            

        }
    });

}
function bindDeleteImage() {
    $('a.picture-delete').unbind().bind('ajax:beforeSend', function () {
        // alert("ajax:before");  
    }).bind('ajax:success', function () {
        console.log($(this).parent().parent());
        $(this).parent().parent().remove();
        //  alert("ajax:success");  
    }).bind('ajax:failure', function () {
        //    alert("ajax:failure");    
    }).bind('ajax:complete', function () {
        //   alert("ajax:complete"); 
    });

}

function bind_mouseover()
{

    $("div.file-block")
            .unbind("mouseenter").mouseenter(function () {
                $(this).parent().find("div.hover-block").fadeIn();
                // console.log("fadeIn");
            })
            .unbind("mouseleave").mouseleave(function () {
                 $(this).parent().find("div.hover-block").fadeOut();
               //   console.log("fadeOut");
           });
}


function bindPicturesSort() {
    
    
    $('div#images').sortable({
    dropOnEmpty: false,
    handle: 'div.file-item',
    cursor: '-webkit-grabbing',
    items: 'div.file-list-item',
    opacity: 0.4,
    scroll: true,
    tolerance: "pointer",
    update: function(){
        console.log($(this));
      $.ajax({
        url: '/articles/update_image_order',
        type: 'post',
        data: $(this).sortable('serialize'),
        dataType: 'json',
        complete: function(request){
        }
      });
    }
  });
  }
  
  
  //  Picture management routines

function initialize_edit_button()
        {
            $("a.edit-picture-article").unbind()
                    .bind("ajax:beforeSend", function(evt, xhr, settings) {
                 //alert("ajax:beforeSend");
            })
                    .bind("ajax:success", function(evt, data, status, xhr) {
                // alert("ajax:success");
                edit_picture_dialog(data);
            })
                    .bind('ajax:complete', function(evt, xhr, status) {
                 //alert("ajax:complete");
            })
                    .bind("ajax:error", function(evt, xhr, status, error) {
                //  alert("ajax:error");

                var $form = $(this),
                        errors,
                        errorText;

                try {
                    // Populate errorText with the comment errors
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                    
                    errors = $.parseJSON(xhr.responseText);
                    console.log(errors);
                    
                } catch (err) {
                    // If the responseText is not valid JSON (like if a 500 exception was thrown), populate errors with a generic error message.
                    errors = {
                        message: "Please reload the page and try again"
                    };
                }
                var errorText;
                // Build an unordered list from the list of errors
                errorText = "<ul>";

                for (error in errors) {
                    console.log(error);
                    console.log(errors[error][0]);
                    errorText += "<li>" + error + ': ' + errors[error][0] + "</li> ";
                    console.log(errorText);
                }

                errorText += "</ul>";
                    console.log(errorText);

                // Insert error list into form
                setUpNotifier("error.png", "Warning", errorText);
            });

        }
        
        
        
        function edit_picture_dialog(data) {

    // alert("ajax:success");
        picture_edit_dialog = createAppDialog(data, "edit-picture", {}, "");
        
        picture_edit_dialog.dialog({
                    close: function (event, ui) {
                      picture_id = $("div#picture-id").text().trim();
                      value =   $("select#picture_title").val();
                      $("div#picture_" + picture_id + " div.picture-info").text(value);
                    }
                });

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
    $(".best_in_place").best_in_place();
    ui_ajax_select();
    //bind_file_upload_to_upload_form();
    //$("button.ui-dialog-titlebar-close").hide();

    //initialize_add_organization();
    //select_subject_field();
    //initialize_select_all_button();
    //initialize_select_none_button();
    //initilize_filter_buttons();

}

function activate_buttons() {
    
    $("div.ui-button a").button();
}



$(document).off('focusin').on('focusin', function (e) {
    if ($(event.target).closest(".mce-window").length) {
        e.stopImmediatePropagation();
        console.log("worked!");
    }
});
