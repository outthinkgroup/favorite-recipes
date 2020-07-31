<?php
/*
Nomenclature:

Standard user feedback:
  Immediately update info.
  .75 opacity
  Upon Success, update info with real data
    1.0 opacity
  Upon failure
    Change bg color to red.

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
    $title = get_the_title($result);
    $link = get_the_permalink($result);
    $response = new WP_REST_Response(['data'=>[
      'title'=> $title,
      'list_id'  => $result,
      'link'    =>  $link,
    ]]);
    $response->set_status(200);
      return $response;
    ///post_error_reporter($result);
  }
  static function rename_list(){
    $data = List_Endpoints::get_json();
    // Update post 37
    $renamed_list = array(
        'ID'           => $data->list_id,
        'post_title'   => $data->title,
    );

    // Update the post into the database
    $result = wp_update_post( $renamed_list );
    // need error reporting.
    $new_title = get_the_title($result);
    $data = array(
      'data' => array(
        'success' => true,
        'title' => $new_title,
        'list_id' => $result
      ));

    $response = new WP_REST_Response($data);
    $response->set_status(200);
    return $response;
  }
  static function delete_list(){
    $data = List_Endpoints::get_json();
    $deleted_list = array(
        'ID'           => $data->list_id,
        'post_status'   => 'trash',
    );

    // Update the post into the database
    $result = wp_update_post( $deleted_list );
    if ( ! is_wp_error($result) ) {
      $data = array(
        'data' => array(
          'success' => true,
          'id' => $result
        )
      );
      $response = new WP_REST_Response($data);
      $response->set_status(200);
      return $response;
    } else {
      $response = new WP_REST_Response(['data'=> 'we had an unknown error']);
      $response->set_status(500);
    }
    
  }
  static function remove_item(){
    $data = List_Endpoints::get_json();
    $item_id = $data->item_id;
    $list_id = $data->list_id;
    $list_items = get_list_items( $list_id );
    $contents = array_search($item_id, $list_items);
    
    if ($contents !== false) {
      unset($list_items[$contents]);
      update_post_meta( $list_id, 'list_items', $list_items);
      $data['success'] = true;
      $data['message'] = 'List ID:'. $list_id .' updated to remove item '. $item_id;
      $response = new WP_REST_Response($data);
      $response->set_status(200);
      return $response;

    } else {
      $response = new WP_REST_Response('it did not work');
      $response->set_status(200);
      return $response;
    }
    //$list_items[] = $item_id;
    // Check if in array.
    // get key of array if so
    // pluck array - need to search
    // save array.
  }
  static function add_item(){
    $data = List_Endpoints::get_json();
    $item_id = $data->item_id;
    $list_id = $data->list_id;
    $list_items = get_list_items( $list_id );
    if (empty($list_items)) {
      $list_items = array();
    }
   
    if (!in_array($item_id, $list_items)) {
      $list_items[] = $item_id;
      update_post_meta( $list_id, 'list_items', $list_items);
      $responsearr = array(
        'data' => array(
          'list_id' => $list_id,
          'item_id' => $item_id,
          'list_count' => get_count($list_id)
        )
      );
      $response = new WP_REST_Response($responsearr);
      $response->set_status(200);
      return $response;
    } else {
      $responsearr = array(
        'error' => false,
        'message' => 'The response was '. false . '. Your list items were not saved.'
      );
      $response = new WP_REST_Response($responsearr);
      $response->set_status(500);
      return $response;
    } 
  }
  function post_error_reporter($id, $data) {
    $return_arr = array();
    if (is_wp_error($post_id)) {
        $errors = $post_id->get_error_messages();
        $error = 'There has been an error --';
        foreach ($errors as $error) {
            $error .= $error;
        }
        $return_arr['error'] = $error;
        $response = new WP_REST_Response($return_arr);
	      $response->set_status(400);
        return $response;
    } else {
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
