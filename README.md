


# node express mongoose CRUD demo

a CRUD demo using node express mongoose with mongo

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

#to identify ubuntu version
lsb_release -a

# clone
These build notes are based on the original tutorial at mdn.
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
https://github.com/mdn/express-locallibrary-tutorial

This repo is https://github.com/aspiringguru/mdn_express_nodejs_skeleton.git

#setup mongo
this is my preferred guide, YMMV.
https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04
from git bash
ssh -i /d/2019_working/coding/sleepyhollowAWSAugust2019.pem ubuntu@13.236.164.196
sftp -i /d/2019_working/coding/sleepyhollowAWSAugust2019.pem ubuntu@13.236.164.196

sudo apt update
sudo apt install -y mongodb
#check status of installed server
sudo systemctl status mongodb
sudo systemctl stop mongodb
sudo systemctl start mongodb
sudo systemctl restart mongodb
sudo systemctl disable mongodb #disable autostart
sudo systemctl enable mongodb  #re-enable autostart
#check firewall status. default port for mongo is 27017
nbb: should not need to allow connection to mongodb from other than localhost
as this system config will connect from nodejs server on same machine
#mongo config file
```
sudo nano /etc/mongodb.conf
sudo systemctl restart mongodb
```
restart mongodb after editing config
```
mongod -v
```
This will return :
```
Data directory /data/db not found
```
on a fresh install. use mongo instead.

# use mongo instead
```
mongo --version
```
#for demo purposes, connect to a database using this format
```
mongo localhost:27017/dbname  #using this format to connect to admin database
mongo localhost:27017/admin
show collections
db.system.version.find()
```

other mongo diagnostics - from bash
```
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```
will return
```
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.3
{
        "authInfo" : {
                "authenticatedUsers" : [ ],
                "authenticatedUserRoles" : [ ]
        },
        "ok" : 1
}
```

Other useful mongo commands
connect to server
```
mongo
```
list available databases
```
show dbs
```
on a freshly install this will show admin and local
# install node (refer other guides) nb: needs LTS
```
node -v  #should return v10.16.3 or later
npm -v   #should return  6.11.3  or later
```

#setup node environment
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
```
sudo npm install express-generator -g
express --help
express --version
#4.16.1
express library_skeleton --view=pug
cd library_skeleton
#to fix permissions issues
sudo chown -R 1000:1000 "/home/ubuntu/.npm"
npm install
vim .gitignore
#insert node_modules/ into .gitignore
git init
git add .
git commit -m 'first commit'
git remote add origin https://github.com/aspiringguru/library_skeleton.git
git push -u origin master
'''
github identified a security alert, upgrade package as advised.
'''
 vim package.json
"clean-css": ">=4.1.11"
git add .
git commit -m 'fix security issue identified by github'
git push
npm install
'''
need to change port number as likely already in use
'''
vim bin/www
var port = normalizePort(process.env.PORT || '3500');
'''


'''
DEBUG=library-skeleton:*
echo $DEBUG
npm start
http://peerbanking.com.au:3500/
13.236.164.196:3500/
sudo lsof -i -P -n | grep LISTEN
sudo lsof -i -P -n | grep 3500
netstat -ano | grep :3500
lynx localhost:3500
ps -o user= -p PIDHERE  #to get owner of a pid
echo $$ #get the PID of the current Bash shell
sudo reboot now
sudo reboot -f  $force
sudo shutdown -r now
sudo systemctl reboot

```
to manage node servers, use pm2
refer this tutorial
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04
http://pm2.keymetrics.io/docs/usage/startup/
pm2 startup
run the script generated by this above. then reboot to test.
```
#check if pm2 installed
pm2 --version
sudo npm install pm2@latest -g
#pm2 start app.js   #does not work
#pm2 start npm      #does not work
pm2 start bin/www   #this works
```
now we want to setup nodemon to auto restart when files edited.
```
npm install --save-dev nodemon
#this takes a while, updates package.json when done
```
edit package.json to use nodemon when starting.
```
"scripts": {
    "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www"
  },
```

instead of using pm2 we can start in dev mode manually
```
pm2 status
#check output to verify which is this app

DEBUG=express-locallibrary-tutorial:*
npm run devstart
```

#Express Tutorial Part 3: Using a Database (with Mongoose)
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
```
npm install mongoose
```
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Connect_to_MongoDB
add connection to mongo via Mongoose
create model files
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Defining_the_LocalLibrary_Schema
```
mkdir models
vim models/author.js
vim models/book.js
vim models/bookinstance.js
vim models/genre.js
```
models created
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Testing_%E2%80%94_create_some_items
```
npm install async
curl -O https://raw.githubusercontent.com/mdn/express-locallibrary-tutorial/master/populatedb.js
node populatedb mongodb://127.0.0.1/library_skeleton
```
now check contents of mongo
```
mongo
show dbs
use library_skeleton
show collections
db.authors.find()
db.bookinstances.find()
db.books.find()
db.genreinstances.find()
db.authors.count()
db.bookinstances.count()
db.books.count()
db.genreinstances.count()
```

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
do the demo as shown.
add wiki.js
edit app_skeleton.js
add req.params example including output of req.params values to console.log
```
http://peerbanking.com.au:3500/wiki
http://peerbanking.com.au:3500/wiki/about
http://peerbanking.com.au:3500/wiki/123456
```
create files for controllers
```
mkdir controllers
touch controllers/authorController.js
touch controllers/bookController.js
touch controllers/bookinstanceController.js
touch controllers/genreController.js

vim controllers/authorController.js
vim controllers/bookController.js
vim controllers/bookinstanceController.js
vim controllers/genreController.js

```
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes#Create_the_catalog_route_module
```
vim routes/index.js
vim routes/users.js
vim routes/catalog.js
```
users.js and wiki.js can be deleted as not required for rest of project

test new routes
use browser and postman
```
http://peerbanking.com.au:3500/
http://peerbanking.com.au:3500/catalog
http://peerbanking.com.au:3500/catalog/books
http://peerbanking.com.au:3500/catalog/bookinstances/
http://peerbanking.com.au:3500/catalog/authors/
http://peerbanking.com.au:3500/catalog/genres/
http://peerbanking.com.au:3500/catalog/book/5846437593935e2f8c2aa226
http://peerbanking.com.au:3500/catalog/book/create
```
to get a list of the book id's in mongo
```
mongo
show dbs
use library_skeleton
show collections
db.books.find()
db.books.count()
db.books.find({},{_id:1});
db.books.distinct('_id', {}, {});
```
Express Tutorial Part 5: Displaying library data
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data
5.1 :  Asynchronous flow control using async
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/flow_control_using_async
npm install async

5.2 : Template primer
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Template_primer

5.3 : LocalLibrary base template
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/LocalLibrary_base_template
```
vim views/layout.pug
mkdir -p public/stylesheets/
vim public/stylesheets/style.css
```


5.4 : Home page
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Home_page

5.5 : book list page
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Book_list_page
```
vim controllers/bookController.js
vim views/book_list.pug
````
check results
http://peerbanking.com.au:3500/catalog/books

5.6 : Book Instance List page
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_list_page
```
vim controllers/bookinstanceController.js
vim views/bookinstance_list.pug
```
load page to test
http://peerbanking.com.au:3500/catalog/bookinstances

5.7 : Date formatting using moment
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Date_formatting_using_moment
```
npm install moment
vim models/bookinstance.js
vim views/bookinstance_list.pug
```

5.8 : Author list page
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Author_list_page
```
vim controllers/authorController.js
vim views/author_list.pug
```
5.8 : genre list challenge.
edit genreController.js and genre_list.pug
```
vim controllers/genreController.js
vim views/genre_list.pug
```

5.9 : Genre detail page
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Genre_detail_page
```
vim controllers/genreController.js
vim views/genre_detail.pug
```

5.10 : Book detail page
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Book_detail_page
```
vim controllers/bookController.js
vim views/book_detail.pug
```

5.11 : Author detail page
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Author_detail_page
```
vim controllers/authorController.js
vim views/author_detail.pug
```

5.12 : BookInstance detail page and challenge
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_detail_page_and_challenge
```
vim controllers/bookinstanceController.js
vim views/bookinstance_detail.pug
```
challenge section
```
vim models/author.js
vim views/author_list.pug
```
format date display for Author lifespan information (date of death/birth)
format BookInstance  pages to use the format: December 6th, 2016.

catalog/authors = catalog.js > author_controller.author_list > author_list.pug
```
vim controllers/authorController.js
vim models/author.js
vim views/author_list.pug
```

6: Express Tutorial Part 6: Working with forms
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms
npm install express-validator

6.1 : Create genre form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_genre_form
```
vim controllers/genreController.js
vim views/genre_form.pug
```
nb: resulting genreController.js is different from mdn git repo

6.2 : Create Author Form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_author_form
```
vim controllers/authorController.js
vim views/author_form.pug
```
date of death added in challenge.

6.3 : Create Book Form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_book_form
```
vim controllers/bookController.js
vim views/book_form.pug
```
nb: The form returns an array of Genre items, convert the request to an array
https://express-validator.github.io/docs/sanitization.html

6.4 : Create BookInstance Form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_BookInstance_form
```
vim controllers/bookinstanceController.js
vim views/bookinstance_form.pug
```

6.5 : Delete Author Form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Delete_author_form
```
vim controllers/authorController.js
vim views/author_delete.pug
vim views/author_detail.pug
```

6.6 : Update Book Form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Update_Book_form
```
vim controllers/bookController.js
vim views/book_form.pug
vim views/book_detail.pug
```
nb this error.
bookController.book_update_post : start
(node:5510) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-

6.7 : Challenge section

Implement the delete pages for the Book, BookInstance, and Genre models

6.7.a : Challenge section - Delete Book
http://peerbanking.com.au:3500/catalog/books > select book
http://peerbanking.com.au:3500/catalog/book/<id>
http://peerbanking.com.au:3500/catalog/book/<id>/delete
from routes/catalog.js
router.get('/book/:id/delete', book_controller.book_delete_get);
edit these methods
  book_controller.book_delete_get
  book_controller.book_delete_post

```
vim controllers/bookController.js
vim views/book_delete.pug
```

6.7.b : Challenge section - Delete BookInstance

http://peerbanking.com.au:3500/catalog/bookinstance/<id>
from routes/catalog.js
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);
edit these methods in book_instance_controller.js
bookinstance_delete_get
bookinstance_delete_post

```
vim controllers/bookinstance_controller.js
vim views/bookinstance_delete.pug
vim views/bookinstance_detail.pug
```

6.7.c : Challenge section - Delete Genre
http://peerbanking.com.au:3500/catalog/genre/<id>
from routes/catalog.js
router.get('/genre/:id/delete', genre_controller.genre_delete_get);
router.post('/genre/:id/delete', genre_controller.genre_delete_post);
update the page generated to display genre results so a delete link is presented.
router.get('/genre/:id', genre_controller.genre_detail); > genre_detail.pug

edit these methods in genre_controller.js
genre_delete_get
genre_delete_post
```
vim controllers/genreController.js
vim views/genre_delete.pug
vim views/genre_detail.pug
```


6.7.d : Challenge section - Update Genre
http://peerbanking.com.au:3500/catalog/genre/<id>/update
from routes/catalog.js
router.get('/genre/:id/update', genre_controller.genre_update_get); > genre_form.pug
router.post('/genre/:id/update', genre_controller.genre_update_post); > genre_form.pug
  or redir to thegenre.url > http://peerbanking.com.au:3500/catalog/genre/<id>/update
```
vim controllers/genreController.js
vim views/genre_delete.pug
vim views/genre_detail.pug
vim views/genre_form.pug
```

1. register subdomain on aws route53
2. update certbot to include new subdomain in certificate (do not update nginx config as seems to break)
3. update nginx config to point domian to correct port number
sudo nginx -t
sudo systemctl reload nginx
4. test node server maps to new domain manually
npm run devstart
5. add new server to pm2, save so reboot of server will autostart
-------------------------------------------
nb: refer package.json to find the scripts required
"start": "node ./bin/www",
"devstart": "nodemon ./bin/www"
-------------------------------------------
pm2 start bin/www
pm2 save
