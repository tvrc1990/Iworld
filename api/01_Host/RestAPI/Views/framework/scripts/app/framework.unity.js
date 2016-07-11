
//字符串是否为空（empty & null & undefind）
String.prototype.IsEmpty = function () {
    if (this.length===0 ||this === '' )
        return true;
    else
        return false;
};

//对象是否为空（包含字符串 不包含数字）
var IsNull = function (obj) {
    if (obj === null || obj === '' || obj === undefined)
        return true;
    else
        return false;
};

//数组是否存在指定元素
Array.prototype.S = String.fromCharCode(2);
Array.prototype.Exists = function (e) {
    var r = new RegExp(this.S + e + this.S);
    return (r.test(this.S + this.join(this.S) + this.S));
};

//删除数组自定索引的元素
Array.prototype.removeIndex = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    this.splice(dx, 1);
}




