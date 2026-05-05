# 🍺 Beer-App

A small fullstack beer application where a user of level 10 or above can like beers and even add beers to the database.
Thanks to the backend the data is shared, making the app update for every client. If client A likes a beer, client B gets a notification saying that client A liked a beer.

# 💻 Technologies
- Javascript
- HTML
- CSS
- Vue 3
- TypeScript
- Playwright

# 🧠 What I learned
- Learned fullstack (REST API). Combining the frontend and the backend, making them communicate with each other.
  
- Making a 'Server Send Event', to allow server to send real time updates to clients as long as they have a open connection.
  (client A likes a beer, client B get a notification stating that client A liked beer A), same vice versa.
  
- Saving a request when offline with the help of cache, and execute that request when back online.
  (user likes beer offline -> *goes back online* -> request is sent to like beer -> beer is liked, and is also displayed)
