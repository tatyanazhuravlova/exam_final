var imgs = document.querySelectorAll('img[data-x-src]');
[].forEach.call(imgs, function(item) {
  item.attributes.src.value = item.attributes['data-x-src'].value;
});
