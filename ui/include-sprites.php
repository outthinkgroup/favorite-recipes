<?php
function include_sprite_sheet_reg(){
  
  ?><h1>HELLLLLLOOOOOO</h1><?php
  include_once FAVORITE_RECIPES_PATH . "assets/svg/font-awesome-reg.svg";
}
add_action( 'astra_body_top', 'include_sprite_sheet_reg', 10);