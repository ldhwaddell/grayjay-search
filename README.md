# GrayJay Search
This is a Google Chrome extension designed to add more functionality to the games page of GrayJay for officials. With this extension, users are able to search for games with certain officials assigned to them. The extension also adds a referee logo next to the game number. When hovered over, this will display the officials assigned to the game without having to click on the game itself. 

### Search
The search function in the extension lets the user finds games with a given crew of officials. The user can select games with a specific Referee #1 and Referee #2, or by pressing the AND button to toggle it to OR, they can find games with either one of these Referees. The user can toggle how matches are displayed at the bottom of the extension. When `Highlight` is pressed, games matching the search with have a blue border. When `Display` is selected, only games that match the search will be shown. 

![Alt text](</images/search.png>)


### Tooltip
The tooltip displays the who is officiating the game when it is hovered over. 

![Alt text](</images/tooltip.png>)

### Building the Extension
To build the extension and rely on a local version rather than one from the Chrome webstore, you can run the command `npm run build` in the project folder. This will bundle React in a minified production mode and optimize the build for the best performance. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).