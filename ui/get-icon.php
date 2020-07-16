<?php
define('SVGS_DIR' , FAVORITE_RECIPES_PATH . 'assets/svg/svgs/');

function get_icon($slug, $type="regular"){
  
  $svg_path = SVGS_DIR . $type .'/'. $slug . '.svg';
  $svg = file_get_contents($svg_path, FILE_USE_INCLUDE_PATH);
  $svg = str_replace('xmlns="http://www.w3.org/2000/svg"', '', $svg);

  echo $svg;
  
}

