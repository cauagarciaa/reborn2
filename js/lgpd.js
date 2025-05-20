const lgpd_cookie_accepted = localStorage.getItem("lgpd_cookie_accepted");

$(document).ready(function () {
  if (!lgpd_cookie_accepted) {
    $("#lgpd").show();
  }
});

function acceptLGPD() {
  localStorage.setItem("lgpd_cookie_accepted", true);
  $("#lgpd").remove();
}
