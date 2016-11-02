'use strict';
docReady(function() {

// carousels init
var carousels = document.querySelectorAll('.carousel');
var flicks = [];

[].forEach.call(carousels, function(item, i) {
  flicks[i] = new Flickity(item, {
    prevNextButtons: false,
    autoPlay: true,
    wrapAround: true,
    contain: true,
    cellSelector: '.carousel__cell',
    pageDots: false,
  });

  var nav = item.querySelectorAll('.carousel__nav');

  if (item.addEventListener) {
    nav[0].addEventListener('click', function() {
      flicks[i].next();
    });
  } else {
    nav[0].attachEvent("onclick", function() {
      flicks[i].next();
    });
  }

  if (item.addEventListener) {
    nav[1].addEventListener('click', function() {
      flicks[i].previous();
    });
  } else {
    nav[1].attachEvent("onclick", function() {
      flicks[i].previous();
    });
  }

});

var grid    = document.querySelector('.grid'),
    input   = document.querySelectorAll('.search-block__input')[0],
    button  = document.querySelectorAll('.search-block__btn')[0],
    searchBtnListener;

if (button.addEventListener) {
  searchBtnListener = button.addEventListener('click', searchHandler);
} else {
  searchBtnListener = button.attachEvent("onclick", searchHandler);
}

function searchHandler(event) {
  var value = input.value;
  if (value) {
    getImages(encodeURIComponent(value));
  }
};

function getImages(query) {
  var xhr,
      q = (query === undefined) ? '' : query,
      orientation = 'all',
      amount = 7,
      method;

  if("onload" in new XMLHttpRequest()) {
    xhr = new XMLHttpRequest();
    method = 'https://'
  } else {
    xhr = new XDomainRequest();
    method = 'http://'
  }

  var url = method +
      'pixabay.com/api/?key=3650660-4488e4e0e00637d736b251941' +
      '&q=' + q +
      '&orientation=' + orientation +
      '&per_page=' + amount +
      '&image_type=photo&pretty=true';

  xhr.open('GET', url);
  xhr.onload = function() {
    var data;

    try {
      data = JSON.parse(xhr.responseText);
    }
    catch(e) {
      emptyGrid();
      grid.innerHTML = '<h2 class="content__title--partners">Server error</h2>';
      grid.style.height = '50px';
      return;
    }

    if (data.hits.length < 7) {
      emptyGrid();
      grid.innerHTML = '<h2 class="content__title--partners">Not found</h2>';
      grid.style.height = '50px';
      return;
    }

    emptyGrid();
    // pick necessary data and render it
    renderGrid(data.hits.map(prepareData));

    initMasonry();

  }

  xhr.send();
}

/**
 *
 * Functions
 *
 */

function initMasonry() {
  var msnry = new Masonry(grid, {
      columnWidth: '.grid__sizer',
      itemSelector: '.grid__item',
      percentPosition: true,
      gutter: 0
  });
}

// callback for map
function prepareData(item) {
  var orient;

  if (item.webformatHeight > item.webformatWidth) {
    orient = 'vertical';
  } else if (item.webformatWidth / item.webformatHeight > 1.6) {
    orient = 'horizontal';
  } else {
    orient = 'polaroid';
  }

  return {
    text: item.tags,
    orientation: orient,
    url: item.webformatURL};
}

function emptyGrid() {
  grid.innerHTML = '';
}

function renderGrid(dataImages) {
  var elem;

  var sizer = document.createElement('div');
  sizer.className = 'grid__sizer';
  grid.appendChild(sizer);

  for (var i = 0, max = dataImages.length; i < max; i++) {
    elem = document.createElement('div');
    var img = document.createElement('div');
    var text = document.createElement('span');

    switch (dataImages[i].orientation) {
      case 'vertical':
        elem.className = 'grid__item grid__item--height2';
        break;
      case 'horizontal':
        elem.className = 'grid__item grid__item--width2';
        break;
      case 'polaroid':
        elem.className = 'grid__item';
        break;
      default:
        elem.className = 'grid__item';
    }

    img.style.backgroundImage = 'url("' + dataImages[i].url + '")';
    img.className = 'grid__img';
    elem.appendChild(img);

    text.innerHTML = dataImages[i].text;
    text.className = 'grid__title';
    elem.appendChild(text);
    grid.appendChild(elem);
  }
}

getImages();
});
