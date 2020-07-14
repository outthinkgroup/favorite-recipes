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
    <div class="lists">
      <h2>My Recipe Lists</h2>
        <?php 
        $listArgs = array(
          'post_type' => 'lists',
          'author' => $user_id,
          'posts_per_page' => '-1'
        );
          $lists = get_posts($listArgs);
          if (!empty($lists)) { ?>
            <ul class='my-lists'>
            <?php
          foreach($lists as $list) { ?>
            <li class="list-item" data-list-id="<?php echo $list->ID; ?>">
              <?php show_list_title_and_count($list); ?>
              <?php show_list_actions($list); ?> 
            </li>
          <?php } ?>
          </ul>
        <?php 
          }
        ?>
    
      <div class="list-bottom">
          <button data-action="show-create-list">Create New List</button>
      </div>
    </div>
  </div>
<?php }





/* 
helpers and html components
*/

function show_list_title_and_count($list){
  ?>
    <div class="recipe-title">
      <span class="count"><?php show_count($list->ID); ?></span>
      <span>
        <a href="<?php echo get_the_permalink($list->ID); ?>">
          <?php echo $list->post_title; ?> 
        </a>
        <button class="minimal" data-action="rename-list">edit name</button>
      </span>

    </div>
  <?php
}
function show_list_actions(){
  ?>
  <div class="list-actions">
    <button type="button" class="primary view-list">View List</button>
    <button type="button" data-action="delete-list" class="danger">Delete</button>
  </div>
  <?php
}
function show_count($list_id){
  $list_items = get_post_meta( $list_id, 'list_items', true);
  if(!is_array($list_items)){
    echo 0;
  } else {
    echo count($list_items);
  }
}

function add_recipe_button($recipe_id){
  global $post;
  if($recipe_id === null){
    $recipe_id = $post->ID;
  }
  ?>
    <button type="button" class="add_item" data-recipe-id="<?php echo $recipe->ID; ?>">Add</button>
  <?php
}