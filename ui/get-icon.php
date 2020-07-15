<?php
define('SVGS_DIR' , FAVORITE_RECIPES_PATH . 'assets/svg/svgs/regular/');


add_action( 'astra_body_top', 'add_icons_to_top' );

// class Get_Icon {
//   public $slug;
//   function __construct($slug){
//     $this->slug = $slug;
//     add_action('svg_symbols', array($this, 'generate_symbol'));
//   }
//   function generate_symbol(){
//     $slug=$this->slug;
//     var_dump($slug);
//     die();
//     $svg_path = SVGS_DIR . $slug . '.svg';
//     $svg = file_get_contents($svg_path, FILE_USE_INCLUDE_PATH);
//     $svg = str_replace('xmlns="http://www.w3.org/2000/svg"', '', $svg);
//     $symbol = str_replace('svg', 'symbol id='.$slug, $svg  );
//     $symbol = str_replace('/svg',  '/symbol',$symbol);
    
//     echo $symbol."\n";
    
//     // return 'hello';
//   }
// }



// function create_callback($slug){
//   return function () use ($slug) {
//     $svg_path = SVGS_DIR . $slug . '.svg';
//     $svg = file_get_contents($svg_path, FILE_USE_INCLUDE_PATH);
//     $svg = str_replace('xmlns="http://www.w3.org/2000/svg"', '', $svg);
//     $symbol = str_replace('svg', 'symbol id='.$slug, $svg  );
//     $symbol = str_replace('/svg',  '/symbol',$symbol);
//     echo $symbol;
//   };
// }

function add_the_action($slug){
  // $callback = create_callback($slug);
  
  add_action('svg_symbols', function(){
    var_dump('pppppppppppppppp "\n"');
    return 'pppppppppp';
  });
}
// add_the_action('sdfsdfs');
function get_icon($slug){
  add_action('init',function(){
    add_the_action($slug);
  });
  echo $slug;
}
function add_icons_to_top(){
?> <svg style="display:none"> <?php
    do_action('svg_symbols');
?> 
</svg>
<h1>hello</h1> 
<?php

}