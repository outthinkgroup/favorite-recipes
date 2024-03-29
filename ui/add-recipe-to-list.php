<?php
function add_recipe_button($iconButton=false, $post_id=null){
  if(!$post_id){
    global $post;
    $post_id = $post->ID;
  }
  $userID = get_current_user_id();
  ?>
  <div class="add-recipe-to-list <?php if($iconButton) echo "list-on-side"; ?>" data-recipe-id="<?php echo $post_id; ?>">
    
    <button class="icon-button <?php if($iconButton) echo "no-text"; ?>" data-action="toggle-list">
      <span class="icon" ><?php get_icon('plus-circle', 'solid'); ?></span>
      <?php 
      if(!$iconButton): ?>
      <span class="button-body">Add To Collections</span>
      <?php endif; ?>  
    </button>
    <?php
    $lists = get_user_lists($userID);
      ?> 
      <div class="button-lists">
        <ul class='lists'> 
        <?php
      if (!empty($lists)) { 
        foreach($lists as $list){
          //! BUG: on collection singles this some times pulls in lists in trash
          if($list->post_status !== "trash"){
          ?>
          <li 
            data-state="idle" 
            data-list-id="<?php echo $list->ID; ?>" 
            data-test="<?php echo $list->post_status;?>"
            <?php if(is_recipe_in_list($post_id, $list->ID)) echo "data-in-list='true'";?>
          >
            <button data-action="add-recipe" class="button-minimal  icon-button with-text" style="--button-alignment:space-between" <?php if(is_recipe_in_list($post_id, $list->ID)) echo "disabled=true";?>>
              <div class="text"><?php show_list_title_and_count($list, ['edit'=> false, 'recipe_link'=>false ]); ?> </div>
              <span class="icon"><?php get_icon('plus', 'solid'); ?></span>
            </button>
          </li>
          <?php } 
          } ?>
        <?php } ?>
          <li data-state="hidden" data-list-id="" >
            <button  data-action="add-recipe" class="button-minimal icon-button with-text" style="--button-alignment:space-between">
              <div class="text"><?php show_list_title_and_count(null, ['edit'=> false, 'recipe_link'=>false ]); ?> </div>
              <span class="icon"><?php get_icon('plus', 'solid'); ?></span>
            </button>
          </li>
        </ul>
      <?php show_create_list_area(); ?>
      </div>
  </div>
  <?php
}
function shortcode_add_recipe_button($atts){
  $atts = shortcode_atts(
        array(
            'icon_button' => false,
            'post_id' => null,
        ), $atts, 'add_recipe_button' );
  ob_start();
  add_recipe_button($atts['icon_button'], $atts['post_id']);
  return ob_get_clean();
}
add_shortcode('add_recipe_button', 'shortcode_add_recipe_button' );


function is_recipe_in_list($post_id, $list_id){
  $recipes = get_list_items($list_id);

  if(is_array($recipes) && in_array($post_id, $recipes)){
    return true;
  }else{
    return false;
  }
}