var Robot = require("./robot.js");
var oOptions = {
    domain:'baidu.com', //ץȡ��վ������
    firstUrl:'http://www.baidu.com/', //ץȡ�ĳ�ʼURL��ַ
    saveDir:"E:\\wwwroot/baidu/", //ץȡ���ݱ���Ŀ¼
    debug:true, //�Ƿ�������ģʽ
};
var o = new Robot(oOptions);
o.crawl(); //��ʼץȡ