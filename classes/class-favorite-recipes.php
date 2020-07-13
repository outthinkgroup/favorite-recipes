<?php
if(!class_exists( 'Favorite_Recipes' )){
  class Favorite_Recipes{

    function __construct(){
      add_action('wp_enqueue_scripts', array($this, 'enqueue_all'));
    }
    public function enqueue_all(){
      wp_enqueue_script('main-script', FAVORITE_RECIPES_URL . '/dist/main.js', array(), true);
      wp_enqueue_style('main-styles', FAVORITE_RECIPES_URL . '/dist/main.css', '1.00' , all);
    }
  }
  new Favorite_Recipes();

}