<?php
function add_favorites_menu_item( $current_menu_items ) {
  $current_menu_items = array_slice( $current_menu_items, 0, 4, true ) 
  + array( 'favorites' => 'My Recipe Lists' )
  + array_slice( $current_menu_items, 4, NULL, true );
  return $current_menu_items;

}
add_filter( 'woocommerce_account_menu_items', 'add_favorites_menu_item', 10, 1 );
    

/**
 * Add endpoint
 */
function add_favorite_endpoint_to_members_area() {
  add_rewrite_endpoint( 'favorites', EP_PAGES );
}
add_action( 'init', 'add_favorite_endpoint_to_members_area' );


add_action( 'woocommerce_account_favorites_endpoint', 'favorites_endpoint_content');
function favorites_endpoint_content(){ ?>
  <h1>Hello World</h1>
<?php }