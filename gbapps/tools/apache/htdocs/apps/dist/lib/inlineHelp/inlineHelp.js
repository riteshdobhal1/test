window.gbInlineHelp = (function () {
    var data = [];
    var url = "lib/inlineHelp/data.json";
    var showMore = false;
    $.get(url, function (response, status) {
        data = response.data;
    });
    return {
        showContextualIcon: function () {
            var prependIcon = false;
            var typesToAppend = ['li', 'div', 'span'];
            data.map(function (item) {
                if (item.enableHelp && !item.appendedIcon) {
                    var id = item.selector;
                    var elem = $(id);
                    var elemType = elem.prop("tagName");
                    if(elemType && typesToAppend.indexOf(elemType.toLowerCase()) >= 0){
                        prependIcon = true;
                    }
                    if (!elem) return;
                    elem.css('position', 'relative');
                    var dynamicId = id.split('#')[1] + '-help-content';
                    var dynamicDdBtn = id.split('#')[1] + '-help-content-btn';
                    var dynamicContentId = dynamicId + '-content-box';
                    var ddBody = '<div class="dropdown gb-inline-contextual-help-field-icon">' +
                        '<a data-toggle="dropdown" class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" id=' + dynamicDdBtn + ' >' +
                        '<i class="fa fa-info-circle"></i></a><div class="dropdown-menu dropdown-menu-'+ item.position +'" style="z-index:103" onclick="event.stopPropagation();">' +
                        '<div class="gb-inline-help-dd-cntr" id=' + dynamicId + '>' +
                        '<div class="gb-inline-help-dd-cntr gb-custom_scroll-bar" id=' + dynamicContentId + '></div>' +
                        '</div>' +
                        '</div></div>';

                    //'<button class="gb-more-btn gb-primary-btn gb-modal-btn-sm"> show more..</button> '+
                    // '<button class="gb-more-btn gb-primary-btn gb-modal-btn-sm"> show less..</button> '+
                    if($(elem).length > 0){
                        var helpIcon = $(ddBody);
                        if(prependIcon){
                            elem.append(helpIcon);
                            item.appendedIcon = true;
                        }else{
                            elem.before(helpIcon);
                            item.appendedIcon = true;
                        }
                    }
                    setTimeout(function () {
                        if (document.getElementById(dynamicDdBtn)) {
                            document.getElementById(dynamicDdBtn).addEventListener("click", function () { gbInlineHelp.loadMessage(item) });
                        }
                    });
                }
            });
        },
        hideContextualIcon: function () {
            data.map(function (item) {
                var id = item.selector;
                var elem = $(id);
                elem.parent().find('.gb-inline-contextual-help-field-icon').remove();
                item.appendedIcon = false;
            });
        },
        loadMessage: function (item) {
            var id = item.selector;
            var urlLink = location.origin + item.link;
            var dynamicId = id.split('#')[1] + '-help-content';
            var dynamicContentId = dynamicId + '-content-box';
            // $('#' + dynamicContentId + '').load(urlLink + "#topic-content .main-content");
            $('#' + dynamicContentId + '').addClass('loader');
            $.ajax({
                url: urlLink,
                type: "GET",
                cache: true,
                success: function (content) {
                    /* Replace Content */
                    $('#' + dynamicContentId + '').html('');
                    $('#' + dynamicContentId + '').html($(content).find("#topic-content .main-content").html());
                    $('#' + dynamicContentId + '').find('img').map(function(){
                        var imageUrl = $(this).attr('src');
                        $(this).attr('src', location.origin + '/context-help/' + item.page + '/' + imageUrl);
                    })
                    $('#' + dynamicContentId + '').removeClass('loader');
                    $('#' + dynamicContentId)[0].scrollTop = 0;
                }
            });
        },
        showMore: function () {

        },
        resetRulesInlineHelp: function(){
            data.map(function (item) {
                if(item.page === 'rules_and_alerts'){
                    item.appendedIcon = false;
                }
            });
        }
    }
})();

