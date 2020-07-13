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
    
        <?php 
        $listArgs = array(
          'post_type' => 'lists',
          //'author' => $user_id,
          'posts_per_page' => '-1'
        );
          $lists = get_posts($listArgs);
          if (!empty($lists)) { ?>
            <ul class='my-lists'>
            <?php
          foreach($lists as $list) { ?>
            <li class="list-item" data-list-id="<?php echo $list->ID; ?>">
              <a href="<?php echo get_the_permalink($list->ID); ?>">
              <?php echo $list->post_title; ?> 
              </a>
               <button type="button" class="rename-button">Rename</button>
               <button type="button" class="delete-button">Delete</button>
               <small><?php var_dump(get_post_meta( $list->ID, 'list_items', true)); ?></small>
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
    <ul class="lists">
    <?php
    foreach ($recipes as $recipe) { ?>
      <li>
        <?php echo $recipe->post_title; ?> <button type="button" class="add_item" data-recipe-id="<?php echo $recipe->ID; ?>">Add</button>
      </li>
    <?php
    }
    ?>
    </ul>
    <div class="tst-area">
     
    </div>
  </div>
<?php }