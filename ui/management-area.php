<?php
function add_favorites_menu_item( $current_menu_items ) {
  $current_menu_items = array_slice( $current_menu_items, 0, 4, true ) 
  + array( 'my-favorites' => 'My Recipe Lists' )
  + array_slice( $current_menu_items, 4, NULL, true );
  return $current_menu_items;

}
add_filter( 'woocommerce_account_menu_items', 'add_favorites_menu_item', 10, 1 );
    

/**
 * Add endpoint
 */
function add_favorite_endpoint_to_members_area() {
  add_rewrite_endpoint( 'my-favorites', EP_PAGES );
}
add_action( 'init', 'add_favorite_endpoint_to_members_area' );


add_action( 'woocommerce_account_my-favorites_endpoint', 'my_favorites_endpoint_content');
function my_favorites_endpoint_content(){
  $user_id = get_current_user_id();
  ?>
  <div class="recipe-list-management-area"
    data-user-id="<?php echo $user_id; ?>"
  >
  <h2>My Recipe Lists</h2>
  <?php 
      $lists = get_user_lists($user_id);
      ?> 
    <div class="lists">
      <ul class='my-lists'> 
      <?php  
        if (!empty($lists)) { 
          foreach($lists as $list) {
            show_list_item($list);
          } 
        }
        //this display a hidden list item with the html skeleton
        //used for creating new list items
        show_list_item();
        ?> 
      </ul>
      <?php show_create_list_area(); ?> 
    </div>
  </div>
  <?php 
}





/* 
helpers and html components
*/

function get_user_lists($user_id){
  $listArgs = array(
    'post_type' => 'lists',
    'author' => $user_id,
    'posts_per_page' => '-1'
  );
  $lists = get_posts($listArgs);
  return $lists;
}
function show_list_item( $list=null ){
  $list_state = $list ? 'idle' : 'hidden';
  ?>
  <li 
    class="list-item"
    data-list-id="<?php if($list) echo $list->ID; ?>"
    data-state="<?php echo $list_state; ?>"
  >
    <?php show_list_title_and_count($list); ?>
    <?php show_list_actions($list); ?> 
  </li> 
  <?php
}
function show_create_list_area(){
  ?> 
  <div class="lists-action">
    <button data-action="show-create-list" class="icon-button with-text icon-left"> <span class="icon"><?php get_icon('plus', 'solid');?></span> <span class="text">Create New List</span></button>
  </div>
  <?php  
}
function show_list_title_and_count($list, $options=['edit'=>true, 'recipe_link'=>true]){
  $titleEl = $options['recipe_link'] ? 'a' : 'span'
  ?>
    <div class="recipe-title" style="--button-color:#efefef">
      <span class="count">
        <?php 
        if($list){
          show_count($list->ID); 
        }else{
          echo 0;
        }
        ?>
      </span>
      <span>
      
         
          <?php if($options['recipe_link']):?> 
          <a class="title-el" href="<?php if($list) echo get_the_permalink($list->ID); ?>" >
          <?php else: ?> 
          <span class="title-el">
          <?php endif; ?>  
       
          <?php 
            if($list){
              echo $list->post_title; 
            } else{
              echo 'New List';
            }
          ?> 
         
          <?php if($options['recipe_link']):?> 
          </a>
          <?php else: ?> 
          </span>
          <?php endif; ?>
        
        <?php if($options['edit']):?>
          <button class="minimal icon-button" data-action="rename-list"><span class="icon"><?php get_icon('edit'); ?></span></button>
        <?php endif; ?>
      </span>
    </div>
  <?php
}

function show_list_actions($list){
  $list_id = $list ? $list->ID : null;
  ?>
  <div class="list-actions">
    <a class="primary button view-list" href="<?php if($list) echo get_the_permalink($list_id); ?>">View List</a>
    <button type="button" data-action="delete-list" class="danger icon-button"><span class="icon"><?php get_icon('delete'); ?></span></button>
  </div>
  <?php
}

function get_list_items($list_id) {
  return get_post_meta( $list_id, 'list_items', true);
}
function show_count($list_id){
  echo get_count($list_id);
}
function get_count($list_id){
  $list_items = get_list_items( $list_id );
  if(!is_array($list_items)){
    return 0;
  } else {
    return count($list_items);
  }
}



function delete_recipe_button($recipe_id){
  global $post;
  if($recipe_id === null){
    $recipe_id = $post->ID;
  }
  ?>
    <button type="button" class="delete_item" data-recipe-id="<?php echo $recipe_id; ?>">Delete</button>
  <?php
}

// NOTE: this should probably be in a front-end functions organization. 
//[show_list_items]
function show_list_items_func( $atts ) {
  global $post;
  $list_items = get_list_items( $post->ID );
  //var_dump($list_items);
  if ( ! empty($list_items) ) {
    $recipes = get_posts(array(
      'post_type' => 'recipe',
      'post__in' => $list_items
    ));
    ob_start(); ?>
    <ul class="my-lists">
      <?php
    foreach ($recipes as $recipe) { ?>
    <li class="list-item">
        <?php echo $recipe->post_title; ?> 
        <div class="list-actions">
          <?php //add_recipe_button($recipe->ID); ?>
          <?php //delete_recipe_button($recipe->ID); ?>
      </div>
      </li>
    <?php } ?>
    </ul>
  <?php
  } else {
    echo 'No Recipes have been added to this list. You might want to add some now.';
  }
  
	return ob_get_clean();;
}
add_shortcode( 'show_list_items', 'show_list_items_func' );