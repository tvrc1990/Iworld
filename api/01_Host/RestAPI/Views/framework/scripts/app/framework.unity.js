
//�ַ����Ƿ�Ϊ�գ�empty & null & undefind��
String.prototype.IsEmpty = function () {
    if (this.length===0 ||this === '' )
        return true;
    else
        return false;
};

//�����Ƿ�Ϊ�գ������ַ��� ���������֣�
var IsNull = function (obj) {
    if (obj === null || obj === '' || obj === undefined)
        return true;
    else
        return false;
};

//�����Ƿ����ָ��Ԫ��
Array.prototype.S = String.fromCharCode(2);
Array.prototype.Exists = function (e) {
    var r = new RegExp(this.S + e + this.S);
    return (r.test(this.S + this.join(this.S) + this.S));
};

//ɾ�������Զ�������Ԫ��
Array.prototype.removeIndex = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    this.splice(dx, 1);
}




