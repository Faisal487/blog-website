require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose')

const homeStartingContent =
  "Hello Folks, Faisal here. I'm a full time procrastinator and part time programmer, who occasionally loves to code and right now trying his best to fill this paragraph so that it can be used in place of a boring lorem-ipsum para. Told you already, a professional procrastinator 😏. Apart from this i love to watch Football so you can guess how i spent my weekends 🙃 .....   If you want to compose a post on this blog-site then click on the Compose button in Navigation bar.   Ciaoo 👋";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"))

mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const composeSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", composeSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
})

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  })
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  })
});

app.get("/compose", function(req, res) {
  res.render("compose");
})


app.post("/compose", function(req, res) {
  const composedPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  composedPost.save(function(err){
    if(!err){
      res.redirect("/")
    }
  });

})

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {title: post.title, content: post.content})
  })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});