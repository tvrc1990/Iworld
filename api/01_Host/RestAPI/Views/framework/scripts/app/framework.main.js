define(['global', 'frameModel'], function (global, frameModel) {
    return {
        //菜单
        MenuObj: {

            data: frameModel.Menus(),

            menuTplFactry: function (data, tempHtml) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].menus != null && data[i].menus.length > 0) {
                        tempHtml += ' <li class="expand"  title=' + data[i].text + '><i class="fa fa-lg fa-' + data[i].ico + '"></i> <span class="over-hide">' + data[i].text + ' <i class="fa fa-caret-down fr"></i></span> <ul> '
                        tempHtml = this.menuTplFactry(data[i].menus, tempHtml);
                        tempHtml += ' </ul> </li>'
                    }
                    else {
                        tempHtml += ' <li  ms-click="clickMenu(this)" title=' + data[i].text + ' ><span class="over-hide"  href=' + data[i].href + '>' + data[i].text + '</span></li> '
                    }
                }
                return tempHtml;
            },

            getMenuTpl: function () {
                return this.menuTplFactry(this.data, '');
            },

            domConvert: function (menuDom) {
                menuDom = $(menuDom).find('span');
                var menuObj = {
                    href: $(menuDom).attr('href'),
                    text: $(menuDom).text(),
                    ico: $(menuDom).attr('class'),
                    isMaximize: global.windoObj.isMaximize,
                    controller: ''
                };

                if (IsNull(menuObj.href)) {
                    return null;
                }
                var tplFileName = menuObj.href.replace(/^.*\/|\..*$/g, "");
                var temp = menuObj.href.split("/");
                menuObj.controller = temp[temp.length - 2] + '_' + tplFileName + '_ctrl';

                return menuObj;
            }

        },

        //窗口
        containerObj: {

            //拖拽移动
            drag: function () {

                var event = (window.event || arguments.callee.caller.arguments[0]);//当前事件对象
                var lockObj = $((event.target || event.srcElement)).parents('.container-box');//当前需要拖动的对象
                var pointX = event.clientX - lockObj.offset().left;
                var pointY = event.clientY - lockObj.offset().top;

                //鼠标移动
                document.onmousemove = function (e) {
                    //正文内容窗口拖拽
                    var containerObj = $('#main_container');
                    if (!IsNull(lockObj)) {

                        event = IsNull(e) ? event : e;
                        var X = event.clientX - pointX;
                        var Y = event.clientY - pointY;

                        var tempX = containerObj.offset().left > X ? containerObj.offset().left : X;
                        var tempY = containerObj.offset().top > Y ? containerObj.offset().top : Y;

                        if (tempY > containerObj.height()) {
                            tempY = containerObj.height();
                        }

                        if (tempX > containerObj.width()) {
                            tempX = containerObj.width();
                        }


                        lockObj.css({ "left": tempX + "px", "top": +tempY + "px" });

                        return false;
                    }

                };

                //鼠标弹起取消拖动
                $(document).unbind('mouseup').mouseup(function () {

                    //正文内容窗口
                    if (lockObj !== null) {
                        lockObj = null;
                        if (event !== null) {
                            event.cancelBubble = true;
                        }
                    }

                });

                return false;
            },

            //最大化&最小化
            changeSize: function (isMaximize, dom) {
                var containerObj = $('#main_container');
                if (isMaximize)
                    $(dom).parents('.container-box').css({ 'width': '50%', 'height': '70%', 'left': containerObj.offset().width / 2, 'top': containerObj.offset().height / 2 });
                else
                    $(dom).parents('.container-box').css({ 'width': '100%', 'height': '96%', 'left': containerObj.offset().left, 'top': containerObj.offset().top });

            },

            //窗口获取焦点
            focus: function (title) {
                var containerObj = $('#main_container');
                var event = (window.event || arguments.callee.caller.arguments[0]);
                var targetObj = targetObj = $((event.target || event.srcElement).parentElement);

                //点击菜单的时候会传递菜单对应的title如果该菜单已经打开就将该菜单对应的窗口设置焦点置顶
                if (!IsNull(title)) {
                    var tempcontainers = containerObj.find('.container-title');
                    for (var i = 0; tempcontainers.length; i++) {
                        if ($(tempcontainers[i]).html() === title) {
                            targetObj = $(tempcontainers[i]).parents('.container-box');
                            break;
                        }
                    }
                }

                var targetIndex = parseInt(targetObj.css("z-index"));
                var othercontainers = containerObj.find('.container-box').not(targetObj);
                for (var i = targetIndex; i < othercontainers.length; i++) {
                    for (var j = targetIndex + 1; j < othercontainers.length; j++) {
                        var temp = othercontainers[i];
                        if (parseInt($(othercontainers[i]).css("z-index")) > parseInt($(othercontainers[j]).css("z-index"))) {
                            othercontainers[i] = othercontainers[j];
                            othercontainers[j] = temp;
                        }
                    }
                }

                if (othercontainers.length > 0) {
                    for (var i = 0; i < othercontainers.length; i++) {
                        othercontainers.eq(i).css("z-index", i);
                    }
                    targetObj.css("z-index", othercontainers.length)
                }
            },

            //窗口操作
            operation: function () {
                var event = (window.event || arguments.callee.caller.arguments[0]);
                var optionIcoDom = $(event.target || event.srcElement);

                var optionBoxDom = optionIcoDom.find('.container-tool-box');//$(event.target).parents('.container-box').find('.container-tool-box');

                optionBoxDom.show();

                optionIcoDom.unbind('mouseleave').mouseleave(function () {
                    optionBoxDom.hide();
                });
            }

        },


        //工具栏
        ToolObj: {

            taskInit: function () {

                //任务栏 隐藏显示
                var taskDom = $('#main_task_tools');
                taskDom.css("right", -taskDom.width());

                var taskTimer;
                taskDom.hover(function () {

                    clearTimeout(taskTimer);
                    taskTimer = setTimeout(function () {
                        taskDom.animate({ right: 0 });
                    }, 500);

                }, function () {

                    $(this).animate({ right: -$(this).width() });
                    clearTimeout(taskTimer);

                });

            },

            topInit: function () {
                var topDom = $('#main_tools');
                var current_user_Dom = topDom.find('.current-user');
                var current_user_content_Dom = topDom.find('.current-user-content');

                current_user_Dom.click(function () {
                    if (current_user_content_Dom.is(':hidden'))
                        current_user_content_Dom.fadeIn(700);
                    else
                        current_user_content_Dom.fadeOut(700);
                    return false;
                });

                current_user_content_Dom.click(function () {
                    event.stopPropagation();
                    return true
                });

                $(document).click(function () {
                    if (!current_user_content_Dom.is(':hidden')) {
                        current_user_content_Dom.fadeOut(700);
                    }
                });

                setInterval(function () {
                    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
                    var date = new Date();
                    var month = date.getMonth() + 1;
                    // var time = date.getFullYear() + '年' + month + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '|' + weeks[date.getDay()];
                    var time = date.getFullYear() + '年' + month + '月' + date.getDate() + '日 ' + weeks[date.getDay()];
                    $('#main_tools').find('.current-time').html(time);
                }, 180000);//3分钟更新一次



            }
        }

    }
});

