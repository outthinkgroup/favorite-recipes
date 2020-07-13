<?php
/*
Nomenclature:
There are lists, and there are items.
They will always be referred to as such:

    list, list_id etc.
    item, item_id etc.

== List Management Functions:
create_list [Also needs to be accessible in front-end]
    Add new recipe list

rename_list
    Change title of list

delete_list
    Deletes entire list

== Recipe Browsing Functions:

remove_item
    removes an item from the list

add_item
    Adds item from the list

*/

class List_Endpoints {
  function __construct(){
    add_action('rest_api_init', array($this, 'init_endpoints'));
  }
  public function init_endpoints(){
    register_rest_route( 'recipe-list/v1', '/create-list', array(
			'methods' => 'POST',
			'callback' => 'List_Endpoints::create_list',
			'args'		=> []	
    ));
    register_rest_route( 'recipe-list/v1', '/rename-list', array(
			'methods' => 'POST',
			'callback' => 'List_Endpoints::rename_list',
			'args'		=> []	
    ));
    register_rest_route( 'recipe-list/v1', '/delete-list', array(
			'methods' => 'POST',
			'callback' => 'List_Endpoints::delete_list',
			'args'		=> []	
    ));
    register_rest_route( 'recipe-list/v1', '/remove-item', array(
			'methods' => 'POST',
			'callback' => 'List_Endpoints::remove_item',
			'args'		=> []	
    ));
    register_rest_route( 'recipe-list/v1', '/add-item', array(
			'methods' => 'POST',
			'callback' => 'List_Endpoints::add_item',
			'args'		=> []	
    ));
  }

 function create_list() {
    $data = List_Endpoints::get_json();
    $new_list_array = array(
        'post_title' => $data->title,
        'post_author' => $data->user_id,
        'post_status' => 'publish',
        'post_content' => '',
        'post_type' => 'lists',
    );
    $result = wp_insert_post($new_list_array);
    //$title = get_the_title($result);
    var_dump($data);
    $response = new WP_REST_Response($result);
    $response->set_status(200);
      return $response;
    ///post_error_reporter($result);
  }
  static function rename_list(){
    $data = List_Endpoints::get_json();
    // Update post 37
    $renamed_list = array(
        'ID'           => $data->list_id,
        'post_title'   => $data->list_id,
    );

    // Update the post into the database
    $result = wp_update_post( $renamed_list );
    // need error reporting.
    post_error_reporter($result);

  }
  static function delete_list(){

  }
  static function remove_item(){
    // Check if in array.
    // get key of array if so
    // pluck array
    // save array.
  }
  static function add_item(){
    $data = List_Endpoints::get_json();
    $item_id = $data->item_id;
    $list_id = $data->list_id;
    $meta_key = 'list_items';
    $list_items = get_post_meta( $list_id, $meta_key, true);
    if (empty($list_items)) {
      $list_items = array();
    }
    // if (!in_array($item_id, $list_items)) {
       $list_items[] = $item_id;
    // }
    //unset($list_items);
    //$list_items = '';
    if (update_post_meta( $list_id, $meta_key, $list_items)) {
      $response = new WP_REST_Response(true);
      $response->set_status(200);
      return $response;
    } else {
      $response = new WP_REST_Response(false);
      $response->set_status(400);
      return $response;
    } 
  }
  function post_error_reporter($id, $data) {
    $return_arr = array();
    if (is_wp_error($post_id)) {
        $errors = $post_id->get_error_messages();
        $error = 'There has been an error --';
        foreach ($errors as $error) {
          // not sure of my syntax here.
            $error .= $error;
        }
        $return_arr['error'] = $error;
        $response = new WP_REST_Response($error);
	      $response->set_status(400);
        return $response;
    } else {
      // 1:43 PM - working on building [data] array.
      //$return_arr
        $response = new WP_REST_Response($id);
	      $response->set_status(200);
        return $response;
    }
  }
  static function get_json(){
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    return $data;
  }
}