let ImageManager = (function() {
  let images = {
      tanke_player_1_izquierda:null,
      tanke_player_1_derecha:null,
      tanke_player_1_arriba:null,
      tanke_player_1_abajo:null,
      base_destroyed:null,
      base:null,
      bullet_right:null,
      bullet_left:null,
      bullet_down:null,
      bullet_up:null,
      wall_brick: null,
      game_over: null
  };
  
  let imagesCount = Object.keys(images).length;
  let imagesLoaded = 0;
  
  for (let i in images) {
    let img = new Image();
    img.src = './images/' + i + '.png';
    img.onload = function () { ++imagesLoaded; };
    images[i] = img;
  }
  
  return {
    getImage: function (name) {
      return images[name];
    },
    getLoadingProgress: function () {
      return Math.floor((imagesLoaded / imagesCount) * 100);
    }
  };

})();
