This is a spell lookup and character creator for Dungeons and Dragons 5th edition. 

Installation: 
Install node.js onto your computer if you don't already have it.
Navigate to the DnDapp folder using your computer's terminal, and then run npm install. From there the app can be run using npm start. Alternatively you can install nodemon and use the command nodemon to run it. 

Dependences which can be installed using "npm install (name of package)": 
http-errors,
express,
path,
cookie-Parser,
morgan,
express-ejs-layouts,
axios,
express-session,
connect-mongodb-session,
mongoose

<h3>Account creation and login:</h3>
In order to use this app, you must first sign up with a username, email, password and age (the password will be encrypted and none of this information will be given to other users.)
<img src="public/Login.png" alt="A picture of the login screen." />

<h3>Spell searching and spell list creation:</h3>
Once the user is signed up, they can click the "search for spells" option on the home page or from the dropdown menu to enter in any text and get a list of spells with descriptions that contain that text.
<img src="public/Search.png" alt="A picture of the screen where the user can enter a word to search." />

The user can then either click the provided URL to go the API's entry on that spell, which contains more information, or add it to a saved list of spells on the application itself for easy viewing later. (Currently, the spells description and other statistics are unavaliable unless the spell's URL is viewed or it is added to the user's list of spells.)
<img src="public/Search Results.png" alt="A picture of the screen showing the user the results of their search." />

Adding a spell or clicking the "Show spell list" button on the main menu will bring the user to a menu showing all of the spells they have saved with important information like the spell's description, it's level, if it's a ritual, it's casting time, and it's range. From their they can also remove any spell from their saved list by pressing the "Remove" button.
<img src="public/Spell List.png" alt="A picture of a created spell list." />

<h3>Character Creation:</h3>
The user can create a new character by clicking "Create a new character" on the home page or from the dropdown menu. They will be asked to fill in basic facts about the character, such as their race, class, level, stats, backstory and a link a picture that represents them.
<img src="public/Character creation.png" alt="A picture of the character creation screen." />

Creating a new character, or clicking the "Show my characters" option in the home menu or dropdown menu will bring the user to a page containing all the characters they've saved along with the inputed information. From there they can choose to edit their characters' information, or delete one of them entirely. 
<img src="public/Created Character.png" alt="A picture of the screen displaying a user's created character." />

<h3>Potential future features:</h3>
If I had the time, I would like to learn how to give each character their own list of spells rather than having the list being based on the user. If I figured out how to do this then I could do the same with other character attributes that have multiple objects as values, such as feats, equipment and multiclassing. I'd also like to have the spell search disallow adding spells that are already present in the user's list. Aside from that, the application could use probably use some touching up to make it prettier.