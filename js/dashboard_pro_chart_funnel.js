$(document).ready(function () {
  let params = new URLSearchParams(document.location.search);

  $.ajax({
    url: "index.php?route=extension/module/dashboard_pro_chart_funnel",
    type: "POST",
    data: {
      route: params.get("route"),
	  origin: document.referrer,
    },
    success: function () {}
  });
});
