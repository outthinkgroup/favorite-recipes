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
    
      <form id="add-list">
        <label for="new-list">Add a List</label>
        <input type="text" name="new-list" id="new-list">
        <button type="submit">Add</button>
      </form>
    </div>
    <?php $recipes = get_posts('post_type=recipe&posts_per_page=-1'); ?>
    <h3>Recipes</h3>
    <ul class="my-lists">
    <?php
    foreach ($recipes as $recipe) { ?>
      <li class="list-item">
        <a href="<?php echo get_permalink($recipe->ID); ?>">
      <?php echo get_the_post_thumbnail( $recipe->ID, 'thumbnail', array('class' => 'small-post-thumbnail') ); ?>
        <?php echo $recipe->post_title; ?> 
    </a>
        <div class="list-actions">
          <?php add_recipe_button($recipe->ID); ?>
          <?php delete_recipe_button($recipe->ID); ?>
      </div>
      </li>
    <?php
    }
    ?>
    </ul>
    
  </div>
<?php }





/* 
helpers and html components
*/


function show_list_title_and_count($list){
  ?>
    <div class="recipe-title">
      <span class="count"><?php show_count($list->ID); ?></span>
      <a href="<?php echo get_the_permalink($list->ID); ?>">
        <?php echo $list->post_title; ?> 
      </a>
    </div>
  <?php
}
function show_list_actions(){
  ?>
  <div class="list-actions">
    <button type="button " class="primary view-list">View List</button>
    <button type="button " class="edit rename-button">Rename</button>
    <button type="button " class="danger delete-button">Delete</button>
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

function add_recipe_button($recipe_id){
  global $post;
  if($recipe_id === null){
    $recipe_id = $post->ID;
  }
  ?>
    <button type="button" class="add_item" data-recipe-id="<?php echo $recipe_id; ?>">Add</button>
  <?php
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
          <?php add_recipe_button($recipe->ID); ?>
          <?php delete_recipe_button($recipe->ID); ?>
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