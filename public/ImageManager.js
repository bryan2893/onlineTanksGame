let ImageManager = (function() {
  let images = {
      tanke_player_1_izquierda:null,
      tanke_player_1_derecha:null,
      tanke_player_1_arriba:null,
      tanke_player_1_abajo:null,
      tank_armor_down_c1_t2:null,
      tank_armor_left_c1_t2:null,
      tank_armor_right_c1_t2:null,
      tank_armor_up_c1_t2:null,
      tank_fast_down_c0_t2:null,
      tank_fast_left_c0_t2:null,
      tank_fast_right_c0_t2:null,
      tank_fast_up_c0_t2:null,
      tank_power_down_c0_t2_f:null,
      tank_power_left_c0_t2_f:null,
      tank_power_right_c0_t2_f:null,
      tank_power_up_c0_t2_f:null,
      tank_power_down_c0_t2:null,
      tank_power_left_c0_t2:null,
      tank_power_right_c0_t2:null,
      tank_power_up_c0_t2:null,
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
