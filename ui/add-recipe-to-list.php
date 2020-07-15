<?php
function add_recipe_button(){
  global $post;

  $post_id = $post->ID;
  $userID = get_current_user_id();
  ?>
  <div class="add-recipe-to-list" data-recipe-id="<?php echo $post_id; ?>">
    <button data-action="toggle-list"><span class="button-body">Add Recipe To List</span><span class="button-icon">&darr;</span></button>
    <?php
    $lists = get_user_lists($userID);
    if (!empty($lists)) { 
      ?> 
      <ul class='button-lists'> 
      <?php
      foreach($lists as $list){
        ?>
        <li>
          <button data-list-id="<?php echo $list->ID; ?>" data-action="add-recipe" class="button-minimal"><?php show_list_title_and_count($list, ['edit'=> false, 'recipe_link'=>false ]); ?></button>
        </li>
       <?php } ?>
       </ul>
    <?php } ?>
  </div>
  <?php
}
function shortcode_add_recipe_button(){
  ob_start();
  add_recipe_button();
  return ob_get_clean();
}
add_shortcode('add_recipe_button', 'shortcode_add_recipe_button' );