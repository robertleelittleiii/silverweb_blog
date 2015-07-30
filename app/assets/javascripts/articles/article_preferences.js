/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var article_preferences_callDocumentReady_called = false;

$(document).ready(function () {
    if (!article_preferences_callDocumentReady_called)
    {
        article_preferences_callDocumentReady_called = true;
        if ($("#as_window").text() == "true")
        {
            //  alert("it is a window");
        }
        else
        {
            article_preferences_callDocumentReady();
        }
    }
});

function article_preferences_callDocumentReady() {
    $("#article-settings-tabs").tabs();
     $(".best_in_place").best_in_place();
    ui_ajax_select();
    $("a.button-link").button();
    
}

