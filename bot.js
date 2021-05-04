// import filterTweets from './twitterapi/tweetfetch'
const filterTweets = require("./twitterapi/tweetfetch")
const { getBotUpdate , sendResponse } = require("./Telebot/telebot")

//[usrTxt , usrId , msgId]
//sendResponse(chatId ,msgId , msg)

async function wrapUp() {
    let objs = await getBotUpdate()
    if(objs){
        filterTweets(objs[0]).then((resultObj)=>{
            for(res of resultObj ) {
                let text = `<strong>Tweeted By  <a href='${res["tweet_link"]}'> ${res["user_name"]}</a></strong>
                            <pre> ${res["text"]} </pre>`
                sendResponse(objs[1] , objs[2] , text)
            }
        })
    }
}
setInterval(wrapUp , 5000) 