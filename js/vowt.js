$.fn.button = function(type) {

	originalHtml = $(this).attr('data-original-html');

	if (!$(this).attr('data-original-html')) {
		originalHtml = $(this).attr('data-original-html', $(this).html());
	}


	if (type == 'loading') {
		$(this).html(`
			<div class="d-flex align-items-center">
				<span class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</span>
				<div class="ms-1">
					Carregando
				</div>
			</div>
		`);
	} else {
		$(this).html(originalHtml);
	}
};

function checkForChanges() {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", "check_changes.php", true);
	xhr.onload = function () {
	  if (xhr.status === 200) {
		const response = JSON.parse(xhr.responseText);
		if (response.changed) {
		  location.reload();
		} else {
		  setTimeout(checkForChanges, 1000); // Verificar a cada 1 segundo
		}
	  }
	};
	xhr.send();
  }
  
  // checkForChanges(); // Iniciar a verificação
  
  function getURLVar(key) {
	var value = [];
  
	var query = String(document.location).split("?");
  
	if (query[1]) {
	  var part = query[1].split("&");
  
	  for (i = 0; i < part.length; i++) {
		var data = part[i].split("=");
  
		if (data[0] && data[1]) {
		  value[data[0]] = data[1];
		}
	  }
  
	  if (value[key]) {
		return value[key];
	  } else {
		return "";
	  }
	}
  }
  
  // Cart add remove functions
  var cart = {
	add: function (product_id, quantity) {
	  $.ajax({
		url: "index.php?route=checkout/cart/add",
		type: "post",
		data:
		  "product_id=" +
		  product_id +
		  "&quantity=" +
		  (typeof quantity != "undefined" ? quantity : 1),
		dataType: "json",
		beforeSend: function () {},
		complete: function () {},
		success: function (json) {
		  $(".alert-dismissible, .text-danger").remove();
  
		  if (json["outstock"]) {
			alert("sem estoque");
		  } else if (json["redirect"]) {
			location = json["redirect"];
		  }
  
		  if (json["success"]) {
			$("#header-cart").load("index.php?route=extension/module/cart/info");
			$("#page-cart").load("index.php?route=extension/module/cart/page_info");
			$("#cart-total").show();
			setTimeout(function () {
			  new bootstrap.Offcanvas(
				document.getElementById("offcanvasCart")
			  ).show();
			}, 100);
		  }
		},
		error: function (xhr, ajaxOptions, thrownError) {
		  alert(
			thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText
		  );
		}
	  });
	}
  };
  
  $(document).ready(function () {
	$(".scroll").click(function (event) {
	  event.preventDefault();
	  // window.history.pushState({url: "" + $(this).attr('href') + ""}, $(this).attr('title') , $(this).attr('href'));
	  $("html,body").animate({ scrollTop: $(this.hash).offset().top - 80 }, 200);
	});
  
	// Highlight any found errors
	$(".text-danger").each(function () {
	  var element = $(this).parent().parent();
  
	  if (element.hasClass("form-group")) {
		element.addClass("has-error");
	  }
	});
  
	// Currency
	$("#form-currency .currency-select").on("click", function (e) {
	  e.preventDefault();
  
	  $("#form-currency input[name='code']").val($(this).attr("name"));
  
	  $("#form-currency").submit();
	});
  
	// Language
	$("#form-language .language-select").on("click", function (e) {
	  e.preventDefault();
  
	  $("#form-language input[name='code']").val($(this).attr("name"));
  
	  $("#form-language").submit();
	});
  
	/* Search */
	$(".search button").on("click", function () {
	  var url = $("base").attr("href") + "index.php?route=product/search";
  
	  var value = $(this).parents(".search").find("input").val();
  
	  if (value) {
		url += "&search=" + encodeURIComponent(value);
	  }
  
	  location = url;
	});
  
	$(".search input[name='search']").on("keydown", function (e) {
	  if (e.keyCode == 13) {
		$(this).parent().find("button").trigger("click");
	  }
	});
  
	// Menu
	$("#menu .dropdown-menu").each(function () {
	  var menu = $("#menu").offset();
	  var dropdown = $(this).parent().offset();
  
	  var i =
		dropdown.left +
		$(this).outerWidth() -
		(menu.left + $("#menu").outerWidth());
  
	  if (i > 0) {
		$(this).css("margin-left", "-" + (i + 10) + "px");
	  }
	});
  
	// Product List
	$("#list-view").click(function () {
	  $("#content .product-grid > .clearfix").remove();
  
	  $("#content .row > .product-grid").attr(
		"class",
		"product-layout product-list col-xs-12"
	  );
	  $("#grid-view").removeClass("active");
	  $("#list-view").addClass("active");
  
	  localStorage.setItem("display", "list");
	});
  
	// Product Grid
	$("#grid-view").click(function () {
	  // What a shame bootstrap does not take into account dynamically loaded columns
	  var cols = $("#column-right, #column-left").length;
  
	  if (cols == 2) {
		$("#content .product-list").attr(
		  "class",
		  "product-layout product-grid col-xl-4 col-md-6 col-sm-12 col-xs-12"
		);
	  } else if (cols == 1) {
		$("#content .product-list").attr(
		  "class",
		  "product-layout product-grid col-xl-4 col-md-6 col-sm-12 col-xs-12"
		);
	  } else {
		$("#content .product-list").attr(
		  "class",
		  "product-layout product-grid col-lg-3 col-md-3 col-sm-6 col-xs-12"
		);
	  }
  
	  $("#list-view").removeClass("active");
	  $("#grid-view").addClass("active");
  
	  localStorage.setItem("display", "grid");
	});
  
	if (localStorage.getItem("display") == "list") {
	  $("#list-view").trigger("click");
	  $("#list-view").addClass("active");
	} else {
	  $("#grid-view").trigger("click");
	  $("#grid-view").addClass("active");
	}
  
	// Checkout
	$(document).on(
	  "keydown",
	  "#collapse-checkout-option input[name='email'], #collapse-checkout-option input[name='password']",
	  function (e) {
		if (e.keyCode == 13) {
		  $("#collapse-checkout-option #button-login").trigger("click");
		}
	  }
	);
  
	// const tooltipTriggerList = document.querySelectorAll(
	//   '[data-bs-toggle="tooltip"]'
	// );
	// const tooltipList = [...tooltipTriggerList].map(
	//   (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
	// );
  });
  
  var wishlist = {
	add: function (product_id) {
	  $.ajax({
		url: "index.php?route=account/wishlist/add",
		type: "post",
		data: "product_id=" + product_id,
		dataType: "json",
		success: function (json) {
		  $(".alert-dismissible").remove();
  
		  if (json["redirect"]) {
			location = json["redirect"];
		  }
  
		  if (json["success"]) {
			Swal.fire({
			  html: json["success"],
			  icon: "success",
			  confirmButtonText: "Ok"
			});
		  }
  
		  $("#wishlist-total span").html(json["total"]);
		  $("#wishlist-total").attr("title", json["total"]);
  
		//   $("html, body").animate({ scrollTop: 0 }, "slow");
		},
		error: function (xhr, ajaxOptions, thrownError) {
		  alert(
			thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText
		  );
		}
	  });
	},
	remove: function () {}
  };
  
  var compare = {
	add: function (product_id) {
	  $.ajax({
		url: "index.php?route=product/compare/add",
		type: "post",
		data: "product_id=" + product_id,
		dataType: "json",
		success: function (json) {
		  if (json["success"]) {
			$("#compare-total").html(json["total"]);
  
			Swal.fire({
			  html: json["success"],
			  icon: "success",
			  confirmButtonText: "Ok"
			});
		  }
		},
		error: function (xhr, ajaxOptions, thrownError) {
		  alert(
			thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText
		  );
		}
	  });
	},
	remove: function () {}
  };
  
  /* Agree to Terms */
  $(document).delegate(".agree", "click", function (e) {
	e.preventDefault();
  
	$("#modal-agree").remove();
  
	var element = this;
  
	$.ajax({
	  url: $(element).attr("href"),
	  type: "get",
	  dataType: "html",
	  success: function (data) {
		html = '<div id="modal-agree" class="modal">';
		html += '  <div class="modal-dialog">';
		html += '    <div class="modal-content">';
		html += '      <div class="modal-header">';
		html +=
		  '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html += '        <h4 class="modal-title">' + $(element).text() + "</h4>";
		html += "      </div>";
		html += '      <div class="modal-body">' + data + "</div>";
		html += "    </div>";
		html += "  </div>";
		html += "</div>";
  
		$("body").append(html);
  
		$("#modal-agree").modal("show");
	  }
	});
  });
  
  // Autocomplete */
  (function ($) {
	$.fn.autocomplete = function (option) {
	  return this.each(function () {
		this.timer = null;
		this.items = new Array();
  
		$.extend(this, option);
  
		$(this).attr("autocomplete", "off");
  
		// Focus
		$(this).on("focus", function () {
		  this.request();
		});
  
		// Blur
		$(this).on("blur", function () {
		  setTimeout(
			function (object) {
			  object.hide();
			},
			200,
			this
		  );
		});
  
		// Keydown
		$(this).on("keydown", function (event) {
		  switch (event.keyCode) {
			case 27: // escape
			  this.hide();
			  break;
			default:
			  this.request();
			  break;
		  }
		});
  
		// Click
		this.click = function (event) {
		  event.preventDefault();
  
		  value = $(event.target).parent().attr("data-value");
  
		  if (value && this.items[value]) {
			this.select(this.items[value]);
		  }
		};
  
		// Show
		this.show = function () {
		  var pos = $(this).position();
  
		  $(this)
			.siblings("ul.dropdown-menu")
			.css({
			  top: pos.top + $(this).outerHeight(),
			  left: pos.left
			});
  
		  $(this).siblings("ul.dropdown-menu").show();
		};
  
		// Hide
		this.hide = function () {
		  $(this).siblings("ul.dropdown-menu").hide();
		};
  
		// Request
		this.request = function () {
		  clearTimeout(this.timer);
  
		  this.timer = setTimeout(
			function (object) {
			  object.source($(object).val(), $.proxy(object.response, object));
			},
			200,
			this
		  );
		};
  
		// Response
		this.response = function (json) {
		  html = "";
  
		  if (json.length) {
			for (i = 0; i < json.length; i++) {
			  this.items[json[i]["value"]] = json[i];
			}
  
			for (i = 0; i < json.length; i++) {
			  if (!json[i]["category"]) {
				html +=
				  '<li data-value="' +
				  json[i]["value"] +
				  '"><a href="#">' +
				  json[i]["label"] +
				  "</a></li>";
			  }
			}
  
			// Get all the ones with a categories
			var category = new Array();
  
			for (i = 0; i < json.length; i++) {
			  if (json[i]["category"]) {
				if (!category[json[i]["category"]]) {
				  category[json[i]["category"]] = new Array();
				  category[json[i]["category"]]["name"] = json[i]["category"];
				  category[json[i]["category"]]["item"] = new Array();
				}
  
				category[json[i]["category"]]["item"].push(json[i]);
			  }
			}
  
			for (i in category) {
			  html +=
				'<li class="dropdown-header">' + category[i]["name"] + "</li>";
  
			  for (j = 0; j < category[i]["item"].length; j++) {
				html +=
				  '<li data-value="' +
				  category[i]["item"][j]["value"] +
				  '"><a href="#">&nbsp;&nbsp;&nbsp;' +
				  category[i]["item"][j]["label"] +
				  "</a></li>";
			  }
			}
		  }
  
		  if (html) {
			this.show();
		  } else {
			this.hide();
		  }
  
		  $(this).siblings("ul.dropdown-menu").html(html);
		};
  
		$(this).after('<ul class="dropdown-menu"></ul>');
		$(this)
		  .siblings("ul.dropdown-menu")
		  .delegate("a", "click", $.proxy(this.click, this));
	  });
	};
  })(window.jQuery);
  