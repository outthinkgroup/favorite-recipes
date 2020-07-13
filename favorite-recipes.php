<?php
/**
 * Plugin Name:Favorite Recipes
 * Plugin URI: 
 * Description: allows users to save and share lists of recipes
 * Version: 1.0
 * Author: outthinkgroup
 * Author URI: https://outthinkgroup.com
 */

define('FAVORITE_RECIPES_PATH', plugin_dir_path(__FILE__));
define('FAVORITE_RECIPES_URL', plugin_dir_url(__FILE__));

 add_action('init', function(){
   require FAVORITE_RECIPES_PATH . '/classes/class-favorite-recipes.php';
 });
