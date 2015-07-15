/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function bindClickToArticleItem () {
    $('.article-item').click(function(){
        //   console.log(this);
        window.location.href = $($(this)).find("a.article-detail-link").attr('href');

    });
}


$(document).ready(function(){

    bindClickToArticleItem();
    
});