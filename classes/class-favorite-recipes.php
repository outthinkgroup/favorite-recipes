<?php
if(!class_exists( 'Favorite_Recipes' )) {
  class Favorite_Recipes{

    public function __construct(){
      add_action('wp_enqueue_scripts', array($this, 'enqueue_all'));
      $this->add_post_type();
      $this->create_management_area();
      $this->add_endpoints();
    }
    
    public function enqueue_all(){
      if(!is_account_page()) return;
      wp_enqueue_script('recipe-list-script', FAVORITE_RECIPES_URL . 'dist/main.js', array(), true);
      wp_enqueue_style('recipe-list-styles', FAVORITE_RECIPES_URL . 'dist/main.css', '1.00' , 'all');

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
  }
  new Favorite_Recipes();

}


/* 
public function __construct(){
    add_action('rest_api_init', array($this, 'init_endpoints'));
  }
  public function init_endpoints(){
    register_rest_route( 'gfoas/v1', '/redirect-settings', array(
			'methods' => 'GET',
			'callback' => 'Redirect_Settings_Endpoints::update_list',
			'args'		=> []	
    ));


    static function update_list(){
      $json = file_get_contents('php://input');
      $data = json_decode($json);
    $res = [];
    
    // $items = get_post_meta($list_id, 'items', true);
    
    //redirects
    $redirects = get_option('redirect_post_types');
    //post types
    $post_types = Redirect_Settings_Endpoints::get_post_type_list();
    //posts_in 
    $posts_in = Redirect_Settings_Endpoints::get_firsts_posts_per($post_types);

    $res['redirects'] = $redirects;
    $res['post_types'] = $post_types;
    $res['posts_in'] = $posts_in;
    $response = new WP_REST_Response($res);
	  $response->set_status(200); 
	  return $response;
  }
*/
