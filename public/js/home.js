$(function() {
  getAllData();

  function getAllData() {
    var url = '/api/articles';
    $.ajax({
      method: "GET",
      url: url,
      success: function(data) {
        $(data).each(function(key, item) {
            createBlock(item);
        });
      },
      error: function(error) {
        alert("Doh!");
      }
    });
  }

  function createBlock(item) {
    var a = $("<a>", {href: "/article/" + item.id});
    console.log($("a").attr("href"));
    var div = $("<div>", {class: "col-md-4"});
    var p = $("<p>", {class: "text-center"});
    var img = $("<img>", {class: "img"});
    p.html(item.title);
    img.attr("src", item.image);
    div.append(img);
    a.append(p);
    div.append(a);
    $(".article").append(div);
  }
});