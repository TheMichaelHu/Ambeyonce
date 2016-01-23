function getScore {
  $.post(
    'https://apiv2.indico.io/fer?key=17ab107868cf822a3deb50a6dff8078a',
    JSON.stringify({
      'data': "img.png"
    })
  ).then(function(res) { console.log(res) });
}

