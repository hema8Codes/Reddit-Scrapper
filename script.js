const mongoose = require("mongoose");
const cheerio = require("cheerio");
const request = require("request-promise");
const RedditArticle = require("./RedditArticle")


async function connectToMongoDb() {
    const url = "mongodb+srv://hema:1234@cluster0.ooomf.mongodb.net/redditscrapper?retryWrites=true&w=majority";
    await mongoose.connect(
        url, 
        { useNewUrlParser: true}
        );
    
      console.log("mongodb connected!")
}

async function scrapeReddit() {
    const html = await request.get("https://www.reddit.com");
    const $ = await cheerio.load(html);
    const titles = $("h3._eYtD2XCVieq6emjKBH3m");

    titles.each(async (i,element) => {
        try{
        const title = $(element).text();
        console.log(title);
        const redditArticle = new RedditArticle({
            title
        });
        await redditArticle.save();
        } catch (err) {
            console.log(err);
        }
    });
}

async function main() {
    await connectToMongoDb();
    await scrapeReddit();
}

main();
