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
        $listargs = array(
          'post_type' => 'lists',
          'author' => $user_id
        );
          $lists = get_posts('post_type=lists');
          if (!empty($lists)) { ?>
            <ul class='my-lists'>
            <?php
          foreach($lists as $list) { ?>
            <li class="list-item">
              <a href="<?php echo get_the_permalink($list->ID); ?>">
              <?php echo $list->post_title; ?> 
              </a>
               <button type="button" class="rename-button">Rename</button>
               <button type="button" class="delete-button">Delete</button>
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
    <div class="tst-area">
      <p>JUST FOR DEBUGGING</p>
    <button class="add-recipe-to-list" data-recipe-id="" >add post to a list</button>
      <?php 
        $listargs = array(
          'post_type' => 'lists',
          'author' => $user_id
        );
          $lists = get_posts('post_type=lists');
          if (!empty($lists)) { ?>
            <ul class='my-lists'>
            <?php
          foreach($lists as $list) { ?>
              <li><button><?php echo $list->post_title; ?></button></li>
          <?php } ?>
            </ul >
      <?php  } ?>
      

    <button >remove post to a list</button>
    </div>
  </div>
<?php }