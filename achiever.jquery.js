/**
 *  Achiever 0.1
 *  settings object:
  {
    type: 'wow', // name of the theme dir (required)
    lang: 'enUS', // locale; will be fetched from theme dir (required)
    achievements: [{ // Array of object to configure the achievements
      name: 'clickmaster', // Internal achievement name; must be unique (required)
      title: 'Clickmaster', // Achievement title (required)
      description: 'Hit the Link ten times', // Achievement description (required)
      icon: 'ambush', // Class name for the icon (required)
      reward: 'My reward', // Adds reward text (optional)
      achieved: 'achieved', // Adds class 'achieved' to flag the achievement in the list on init. (optional)
      extended: { // Adds function to add/remove expand class on click to display some kind of plus sign (optional)
        description: 'Zehnmal klicken und gewinnen!', // Extended description (optional)
        progress: { // Show progressbar with counter (optional)
          current: 8, // Current points (required)
          total: 10, // Total points to get the achievement (required)
          delimiter: ' / ' // The delimiter between current and total (required)
        }
      },
    }]
  }
 
 */

;(function($){

  var methods = {
    init : function(settings) { 
      if($('body').data('achiever')) return;
      var config = {
        type : 'wow',
        lang : 'enUS'
      };
      if(settings) $.extend(config, settings);
      
      if(!config.achievements.length) return;
      
      var $body = $('body');
      $body.data('achiever', true);
      $body.append('<ul id="achievement-list-container" class="off"/>');
      $body.append('<div id="achievements-container"/>');
      
      // Fetch additional data, locale
      $.getJSON('theme/'+config.type+'/theme.json', function(data){
      
        // GET mustache template for achievement
        $.get('theme/'+config.type+'/achievement_item.html', function(html){
          $.each(config.achievements, function(){
            $.extend(this, {localizedStrings: data.i18n[config.lang]});
            $('#achievements-container').append(Milk.render(html, this));
          });
        }, 'html');
        
        // GET mustache template for list item
        $.get('theme/'+config.type+'/achievement_list_item.html', function(html){
          $.each(config.achievements, function(){
            $.extend(this, {localizedStrings: data.i18n[config.lang]});
            $('#achievement-list-container').append(Milk.render(html, this));
            $.achiever('achievementInList', this.name).data('achievement', this);
            if(this.extended){
              var archievementName = this.name;
              $('#'+archievementName+'-achievement-item').click(function(event){
                event.preventDefault();
                $('#'+archievementName+'-achievement-item').toggleClass('expand');
              });
              if(this.extended.progress){
                $.achiever('alterProgress', archievementName, this.extended.progress.current, true);
              }
            }
          });
        }, 'html');
      });
    },
    achievement : function(name){
      return $('#'+name+'-achievement');
    },
    achievementInList : function(name){
      return $('#'+name+'-achievement-item');
    },
    show : function(name) {
      if(!$.achiever('achieved', name)){
        return $.achiever('achievement', name).fadeIn('slow');
      }
    },
    achieved : function(name){
      return $.achiever('achievementInList', name).hasClass('achieved');
    },
    present : function(name){
      $.achiever('show', name);
        setTimeout(function(){
          $.achiever('hide', name);
        }, 5000);
      return;
    },
    achieve : function(name, silent){
      if($.achiever('achievement', name).is(':visible')) return;
      $('#achievements-container > :visible:last').after($.achiever('achievement', name));
      if(!silent) $.achiever('present', name);
      var $achievementInList = $.achiever('achievementInList', name),
      progress = $achievementInList.data('achievement');
      return $.achiever('achievementInList', name).toggleClass('achieved', progress.current == progress.total);
    },
    alterProgress : function(name, value, set){
      if($.achiever('achieved', name)) return;
      var $achievementInList = $.achiever('achievementInList', name);
      if($achievementInList.length == 0) return;
      var progress = $achievementInList.data('achievement').extended.progress;
      if(!set) progress.current += value;
      if(progress.current >= progress.total || $.achiever('achieved', name)){
        progress.current = progress.total;
        $.achiever('achieve', name, set);
      }
      $achievementInList.find('.progressbar-text').text(progress.current+''+progress.delimiter+''+progress.total);
      $achievementInList.find('.progressbar').css('width', ((progress.current/progress.total)*100)+'%');
      return;
    },
    toggleList : function(){
      return $('#achievement-list-container').fadeToggle();
    },
    hide : function(name) {
      return $.achiever('achievement', name).fadeOut('slow');
    }
  };

  $.achiever = function(method){
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.achiever' );
    }
  }
})(jQuery);