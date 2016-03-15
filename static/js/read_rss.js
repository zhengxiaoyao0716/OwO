var rss_items, rss_sjz_items, items;
//实现跨域抓取的关键，雅虎提供的Yql查询服务
function pull_rss(filt) {
  $('#waiting').modal('show');
  $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D"' + 'http://zhengxiaoyao0716.lofter.com/rss' + '"&format=json&diagnostics=true&callback=?', function(data) {
    rss_items = data.query.results.rss.channel.item;
    if (!filt) filt = function() { items = rss_items; }
    filt();
    init_pagination();
    $('#waiting').modal('hide');
  });
}
function pull_rss_sjz() {
  function filt() {
    rss_sjz_items = [];
    for (var index in rss_items)
    {
      var item = rss_items[index];
      if (item.title.indexOf("三界志，") >= 0)
      {
        rss_sjz_items.push(item);
      }
    }
    items = rss_sjz_items;
  }
  if (!rss_items) pull_rss(filt);
  else
  {
    filt();
    init_pagination();
  }
}
function read_rss(page) {
    page *= 6;
    var index;
    for (index = page - 6; index < items.length && index < page; index++)
    {
      var item = items[index];
      var contain = item.description.substring(0, item.description.lastIndexOf('<a'));
      contain = contain.substring(0, contain.lastIndexOf('<a'));
      $(".contain").append(
        '<li class="col-sm-4"><div class="thumbnail caption"  style="height:300px; overflow:hidden; text-overflow:ellipsis">'
        + '<a href="' + item.link + '" target="_blank"><h3>' + item.title + '</h3></a>'
        + '<small class="light-primary-color">' + item.pubDate + '</small>'
        + '<div>' + contain + '</div>'
        + '</div></li>'
      );
    }
}
