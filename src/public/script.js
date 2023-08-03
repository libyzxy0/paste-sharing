$("#create-paste").click(function() {
    let name = $("#name").val();
    let password = $("#password").val();
    let paste = $("#paste").val();
    if (!name || !paste) {
        $("#create-paste").text('Please fillup required input.');
        $("create-paste").attr("disabled", true);
    $("#create-paste").removeClass("btn-warning").addClass("btn-danger");
        setTimeout(function() {
        $("#create-paste").text('Create Paste');
        $("#create-paste").removeAttr("disabled");
       $("#create-paste").removeClass("btn-danger").addClass("btn-primary");
}, 2000);
     return;
    }
    const formData = { name, password, paste };
    $("#create-paste").text('Creating paste...');
    $("create-paste").attr("disabled", true);
    $("#create-paste").removeClass("btn-primary").addClass("btn-warning");
    $.ajax({
      type: "POST",
      url: "https://paste-sharing.libyzxy0.repl.co/api/new-paste",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function(response) {
        $("#copynclose").click( function() {
            navigator.clipboard.writeText(response.url)
            .then(() => {
                $("#copynclose").text('Copied!');
                setTimeout(() => {
                    $("#copynclose").text('Copy Url');
                }, 2000)
            })
        })
        $("#create-paste").text("Paste Successfully Created")
        $("#paste-information").modal("show");
        $("#paste-info").html(`<p><b>Paste Name </b>${response.name}</p><p><b>Paste Url </b>${response.url}</p><p><b>Paste ID </b>${response.id}</p><p><b>Created at </b>${response.created}</p><p><b>Expire at </b>${response.expire}</p>`);
        $("#create-paste").text('Successfully created paste');
       $("#create-paste").removeClass("btn-warning").addClass("btn-success");
       setTimeout(function() {
        $("#create-paste").text('Create Paste');
        $("#create-paste").removeAttr("disabled");
       $("#create-paste").removeClass("btn-success").addClass("btn-primary");
}, 2000);

      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
        $("#create-paste").text('An error occurred.');
        $("create-paste").attr("disabled", true);
    $("#create-paste").removeClass("btn-warning").addClass("btn-danger");
        setTimeout(function() {
        $("#create-paste").text('Create Paste');
        $("#create-paste").removeAttr("disabled");
       $("#create-paste").removeClass("btn-danger").addClass("btn-primary");
}, 2000);
      }
    });
});
