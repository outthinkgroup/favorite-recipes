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
          ?>
          <li data-state="idle" data-list-id="<?php echo $list->ID; ?>">
            <button data-action="add-recipe" class="button-minimal  icon-button with-text" style="--button-alignment:space-between">
              <div class="text"><?php show_list_title_and_count($list, ['edit'=> false, 'recipe_link'=>false ]); ?> </div>
              <span class="icon"><?php get_icon('plus', 'solid'); ?></span>
            </button>
          </li>
          <?php } ?>
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
