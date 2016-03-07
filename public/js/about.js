$(function() {
  getAllData('');
  $("form").submit(function(e) {
    e.preventDefault();
    $(".article").html("");
    var searchContent = $("input").val();
    getAllData(searchContent);
    $("input").val('');
  });

  $("input").keyup(function() {
    //console.log($("input").val());
    var searchContent = $("input").val();
  });

  function getAllData(keyword) {
    var url = '/api_for_category/categories';
    $.ajax({
      method: "GET",
      url: url,
      success: function(data) {
        var reg = new RegExp(keyword,'i');
        $(data).each(function(key, item) {
          if(keyword === '' || reg.test(item.title)){
            createBlock(item);
          }
        });
      },
      error: function(error) {
        alert("Doh!");
      }
    });
  }

  function createBlock(item) {
    var a = $("<a>", {href: "categories/" + item._id});
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