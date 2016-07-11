
define(['avalon', 'linq', 'frameMain'], function (avalon, linq, frameMain) {

    var containerModel = avalon.define({
        $id: "containerCtrl",

        containerArray: new Array(),
        menuObj:null,
        open: function (menuDom) {
            menuObj = frameMain.MenuObj.domConvert(menuDom);
            if (menuObj === null || menuObj.text === null) {
                return false;
            }

            var isExists = Enumerable.From(containerModel.containerArray).Where("x=>x.text=='" + menuObj.text + "'").ToArray().length === 0;

            if (menuObj != null && isExists) {
                containerModel.containerArray.push(menuObj);
            }
            else {
                frameMain.containerObj.focus(menuObj.text);
            }
        },

        //action[add, del, move, index]
        renderer: function (action) {

            if (action === 'add') {              
                require([menuObj.controller], function (ctrl) {
                    ctrl.renderer();
                })
            }
        },

        close: function (index) {
            containerModel.containerArray.removeIndex(index);
        },

        drag: function () {
            var container = frameMain.containerObj;
            container.focus();
            container.drag();

        },

        focus: function () {
            var container = frameMain.containerObj
            container.focus();
        },

        changeSize: function (index, dom) {
            var temp = containerModel.containerArray[index];
            frameMain.containerObj.changeSize(temp.isMaximize, dom);
            containerModel.containerArray[index].isMaximize = temp.isMaximize ? false : true;
        },

        operation: function () {
            frameMain.containerObj.operation()
        }

    });

    var menuModel = avalon.define({
        $id: "menuCtrl",
        menuTemplate: frameMain.MenuObj.getMenuTpl(),

        clickMenu: function (menuDom) {
            containerModel.open(menuDom);
        }

    });

    return {
        renderer: function () {
            avalon.scan();
        }
    }


});
