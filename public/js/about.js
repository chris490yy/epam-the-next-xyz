$(function() {
  var url = '/api_for_category/categories';
  getAllData('');

  $("form").submit(function(e) {
    e.preventDefault();
    $(".article").html("");
    var searchContent = $("input").val();
    getAllData(searchContent);
    $("input").val('');
  });

  // $("input").blur(function() {
  //   $('.drop-area').html("");
  // });

  $("input").keyup(function() {
    $('.drop-area').html("");
    var searchContent = $("input").val().trim();
    $.ajax({
      method: "GET",
      url: url,
      success: function(data) {
        var reg = new RegExp(searchContent,'i');
        $(data).each(function(key, item) {
          if(searchContent === '')return;
          if(reg.test(item.title)){
            createDrop(item);
          }
        });
      },
      error: errorFunc
    });

  });

  function getAllData(keyword) {
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
      error: errorFunc
    });
  }

  function createBlock(item) {
    var a = $("<a>", {href: "categories/" + item._id});
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

  function createDrop(item) {
    var div = $("<div>", {class: "drop"});
    var p = $("<p>");
    var a = $("<a>", {href: "categories/" + item._id});
    p.html(item.title);
    a.append(p);
    div.append(a);
    $(".drop-area").append(div);
  }


  function errorFunc(e) {
    alert("Doh!");
  }
});