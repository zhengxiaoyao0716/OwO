var choosed_tab;
function pre_change(id) {
  choosed_tab.removeAttr("class");
  choosed_tab = $(id);
  choosed_tab.attr("class", "active")
  $(".contain").empty();
  $(".pagination").empty();
}
function main_sites() {
  pre_change("#main_sites");
  $(".contain").append(
    '<div class="col-sm-4">\
      <a class="thumbnail" href="http://zhengxiaoyao0716.lofter.com/" target="_blank">\
        <img src="./static/image/lofter.jpg" class="img-responsive" />\
        <div class="caption">\
          <h3 align="center">\
            正的博客\
          </h3>\
        </div>\
      </a>\
    </div>\
    <div class="col-sm-4">\
      <a class="thumbnail" href="http://blog.csdn.net/zhengxiaoyao0716" target="_blank">\
        <img src="./static/image/csdn.jpg" class="img-responsive" />\
        <div class="caption">\
          <h3 align="center">\
            技术文章\
          </h3>\
        </div>\
      </a>\
    </div>\
    <div class="col-sm-4">\
      <a class="thumbnail" href="https://github.com/zhengxiaoyao0716" target="_blank">\
        <img src="./static/image/github.jpg" class="img-responsive" />\
        <div class="caption">\
          <h3 align="center">\
            开源项目\
          </h3>\
        </div>\
      </a>\
    </div>'
  );
}
function last_news() {
  pre_change("#last_news");
  items = rss_items;
  if (items) init_pagination();
  else pull_rss();
}
function san_jie_zhi() {
  pre_change("#san_jie_zhi");
  items = rss_sjz_items;
  if (items) init_pagination();
  else pull_rss_sjz();
}
$(document).ready(function() {
  choosed_tab = $("#main_sites");
  main_sites();
});
