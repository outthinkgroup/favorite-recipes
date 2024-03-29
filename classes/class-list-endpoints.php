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
    register_rest_route( 'recipe-list/v1', '/change-list-status', array(
			'methods' => 'POST',
			'callback' => 'List_Endpoints::change_list_status',
			'args'		=> []	
    ));
    register_rest_route( 'recipe-list/v1', '/fork-list', array(
			'methods' => 'POST',
			'callback' => 'List_Endpoints::fork_list',
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



  // == CRUD METHODS FOR THE COLLECTIONS THEMSELVES == //

 function create_list() {
    $data = List_Endpoints::get_json();
    $status = $data->status ? $data->status : 'private';
    $new_list_array = array(
        'post_title' => $data->title,
        'post_author' => $data->user_id,
        'post_status' => $status,
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

  /**
   * ? In json body
   * - list_id: id of the list
   * - status: string of new status ('private' | 'publish')
   * - user_id: current user's Id
   */
  static function change_list_status(){
    $data = List_Endpoints::get_json();
    $returned_data = [];
    //TEST id = 9184
    if(List_Endpoints::list_belongs_to_user($data->list_id, $data->user_id)){
      $new_status = $data->status;
      $updated_collection = [
        'ID'  => $data->list_id,
        'post_status'=> $new_status
      ];
      $result = wp_update_post( $updated_collection );
      if(!is_null($result) && !is_wp_error($result)){
        $returned_data['data']['success'] = true;
        $returned_data['data']['list_id'] = $result;
        $returned_data['data']['status'] = get_post($result)->post_status;
      }else{
        $returned_data['error']['message'] = $result;
      }

    }else{
      $returned_data['error']['message'] = 'you do not have permission to edit this list ';
    }
    
    $response = new WP_REST_Response($returned_data);
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


  static function fork_list(){
    $data = List_Endpoints::get_json();
    $old_post_id = $data->list_id;
    $user_id = $data->user_id;
    $result = List_Endpoints::duplicate_list($old_post_id, $user_id);

    if ( ! is_wp_error($result) ) {
      $title = get_the_title($result);
      $link = get_the_permalink($result);
      
      $return_data = array(
        'data' => array(
          'success' => true,
          'title'=> $title,
          'list_id'  => $result,
          'link'    =>  $link,
        )
      );
      $response = new WP_REST_Response($return_data);
    
    } else {
      $response = new WP_REST_Response(['error'=> ['message'=> 'we had an unknown error']]);
    }
    $response->set_status(200);
    return $response;
  }


  // == ADDING AND REMOVING RECIPES FROM COLLECTIONS == //

  static function remove_item(){
    $data = List_Endpoints::get_json();
    $item_id = $data->item_id;
    $list_id = $data->list_id;
    $list_items = get_list_items( $list_id );
    $contents = array_search($item_id, $list_items);
    
    if ($contents !== false) {
      unset($list_items[$contents]);
      update_post_meta( $list_id, 'list_items', $list_items);
      
      unset($data);
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
  
  static function list_belongs_to_user($id, $user_id){  
    $list = get_post($id);
    $list_author_id = $list->post_author;
    if($list_author_id === $user_id){
      return true;
    } else{
      return false;
    }
  }

  static function duplicate_list($post_id, $user_id) {
    $title   = get_the_title($post_id);
    $oldpost = get_post($post_id);
    $post    = array(
      'post_title' => $title,
      'post_status' => 'publish',
      'post_type' => $oldpost->post_type,
      'post_author' => $user_id
    );
    $new_post_id = wp_insert_post($post);
    // Copy post metadata
    $data = get_list_items($post_id);
    
    add_post_meta($new_post_id, 'list_items', $data);
    return $new_post_id;
  }
}