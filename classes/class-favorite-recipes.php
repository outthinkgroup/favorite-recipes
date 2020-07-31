<?php
if(!class_exists( 'Favorite_Recipes' )) {
  class Favorite_Recipes{

    public function __construct(){
      add_action('wp_enqueue_scripts', array($this, 'enqueue_all'));
      $this->add_post_type();
      $this->create_management_area();
      $this->button_shortcode();
      $this->add_endpoints();
      // include_once FAVORITE_RECIPES_PATH . '/ui/include-sprites.php';
      include_once FAVORITE_RECIPES_PATH . '/ui/get-icon.php';
    }
    
    public function enqueue_all(){
      //TODO seperate the styles and scripts that need only to apply to the management page, and what should be global
      wp_enqueue_script('fr-global-scripts', FAVORITE_RECIPES_URL . 'dist/global.js', array(), true);
      wp_enqueue_style('fr-global-styles', FAVORITE_RECIPES_URL . 'dist/global.css', '1.00' , 'all');
      wp_localize_script( 'fr-global-scripts', 'WP', [
        'userId' => get_current_user_id(),
       ] );
      wp_enqueue_script('fr-account-page-script', FAVORITE_RECIPES_URL . 'dist/account-page.js', array(), true);
      wp_enqueue_style('fr-account-page-styles', FAVORITE_RECIPES_URL . 'dist/account-page.css', '1.00' , 'all');

    }
    //change for real env
    public function create_management_area(){
      include FAVORITE_RECIPES_PATH . 'ui/management-area.php';
    }

   function register_recipe_list_post_type(){
    $labels = [
      'name'                  => _x( 'Recipe List', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Recipe List', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'Recipe Lists', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Recipe List', 'Add New on Toolbar', 'textdomain' ),
    ];

    $args = [
      'labels'             => $labels,
      'public'             => true,
      'publicly_queryable' => true,
      'show_ui'            => true,
      'show_in_menu'       => true,
      'query_var'          => true,
      'rewrite'            => array( 'slug' => 'recipe-list' ),
      'capability_type'    => 'post',
      'has_archive'        => true,
      'hierarchical'       => false,
      'menu_position'      => null,
      'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments', 'custom-fields' ),
    ];

      register_post_type( 'lists', $args );
      flush_rewrite_rules();
    }
    function add_post_type(){
      add_action('init', array($this, 'register_recipe_list_post_type'));
    }
    function add_endpoints(){
      include_once FAVORITE_RECIPES_PATH . 'classes/class-list-endpoints.php';
      new List_Endpoints();
    }
    function button_shortcode(){
      include_once FAVORITE_RECIPES_PATH . 'ui/add-recipe-to-list.php';
    }
  }
  new Favorite_Recipes();

}


