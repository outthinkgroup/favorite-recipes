<?php
if(!class_exists( 'Favorite_Recipes' )){
  class Favorite_Recipes{

    function __construct(){
      add_action('wp_enqueue_scripts', array($this, 'enqueue_all'));
      add_action( 'init', array($this, 'register_recipe_list_post_type'), 0 );
      // Register Custom Post Type
      $this->create_management_area();
    }
    
    public function enqueue_all(){
      wp_enqueue_script('main-script', FAVORITE_RECIPES_URL . 'dist/main.js', array(), true);
      wp_enqueue_style('main-styles', FAVORITE_RECIPES_URL . 'dist/main.css', '1.00' , 'all');
      // Need to add post types
      
      
    }
    //change for real env
    public function create_management_area(){
      include FAVORITE_RECIPES_DIR . 'ui/management-area.php';
    }
    // Registering Post Type
    public function register_recipe_list_post_type() {
      die();
      $labels = array(
        'name'                  => _x( 'Recipe Lists', 'Post Type General Name', 'text_domain' ),
        'singular_name'         => _x( 'Recipe List', 'Post Type Singular Name', 'text_domain' ),
        'menu_name'             => __( 'Post Types', 'text_domain' ),
        'name_admin_bar'        => __( 'Post Type', 'text_domain' ),
        'archives'              => __( 'Item Archives', 'text_domain' ),
        'attributes'            => __( 'Item Attributes', 'text_domain' ),
        'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
        'all_items'             => __( 'All Items', 'text_domain' ),
        'add_new_item'          => __( 'Add New Item', 'text_domain' ),
        'add_new'               => __( 'Add New', 'text_domain' ),
        'new_item'              => __( 'New Item', 'text_domain' ),
        'edit_item'             => __( 'Edit Item', 'text_domain' ),
        'update_item'           => __( 'Update Item', 'text_domain' ),
        'view_item'             => __( 'View Item', 'text_domain' ),
        'view_items'            => __( 'View Items', 'text_domain' ),
        'search_items'          => __( 'Search Item', 'text_domain' ),
        'not_found'             => __( 'Not found', 'text_domain' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
        'featured_image'        => __( 'Featured Image', 'text_domain' ),
        'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
        'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
        'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
        'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
        'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
        'items_list'            => __( 'Items list', 'text_domain' ),
        'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
        'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
      );
      $args = array(
        'label'                 => __( 'Recipe List', 'text_domain' ),
        'description'           => __( 'List of Favorites', 'text_domain' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'custom-fields' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'page',
      );
      register_post_type( 'recipe_list', $args );
    
    }

  }
  new Favorite_Recipes();

}
