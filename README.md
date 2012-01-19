Achiever
========

Achiever adds achievements to your website on the frontend side using jquery. First bundled theme is WoW theme. 

Usage
-----

Achiever uses Milk for mustache templates. The minified version already includes Milk.
Return an object similar to this from your webservice (, wait for localstorage support, or just hardcode it in your js (only to try it!)). This is your data.


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
  
Then anytime you think your users did something that deserves an achievement call this:

    $.achiever('achieve', name); // name is the internal unique achievement name
  
If you provide the progress indicator just do:

    $.achiever('alterProgress', name, step); // name is the internal unique achievement name

'step' is the number you want to _add_ to the current progress. If the current progress matches the total, the achieved is considered unlocked.

To show the user the list of all available achievements including his progress:

    $.achiever('toggleList');
  
Advanced
--------

    $.achiever('achieved', name) // checks whether the achievement 'name' has been unlocked