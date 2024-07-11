# Hi I'm Sahil

### Tech Stack
*   Backend - Nodejs
*   Frontend - HTML, CSS, JavaScript

### So to bootstrap this chat-app locally on your machine, follow the steps below.

* Clone the project locally using this command
```bash
git clone https://github.com/Sahildarunde/chat-app.git
```
* Do install packages in client & server using
```bash
cd server 
npm install

cd client
npm install
```

* Now create .env file in server folder and include below code there
```bash
JWT_SECRET=chat-app
MONGODB_URI=mongodb://localhost:27017/chat-app
```

* To run the mongodb locally use docker
```bash
docker run --name chat-app -d -p 27017:27017 mongo 
```

* Also install http-server globally or use live server to run client side code
```bash
npm install -g http-server
```

* To run the client side code
```bash
cd start
npm start

OR

npx live server
```

* To run server side code
```bash
cd server
npm start
```

* After doing these steps you'll be able to access the client at 
```bash
http://localhost:8080 - if you're using http-server 

OR

http://localhost:5500 - if you're using live server
```


* To access server from postman 
```bash
http://localhost:3000/register
http://localhost:3000/login
```