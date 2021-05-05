const filterTweets = require("./twitterapi/tweetfetch")
const { getBotUpdate , sendResponse } = require("./Telebot/telebot")

async function wrapUp() {
    let text
    let objs = await getBotUpdate()
    if(objs){
        filterTweets(objs[0]).then((resultObj)=>{
            if(resultObj.length != 0){
                resultObj.forEach((res)=>{
                    text = `<strong>Tweet Link 👉 <a href='${res["tweet_link"]}'> ${res["user_name"]}</a></strong>\n\n<b> ${res["text"]}</b>`
                    sendResponse(objs[1] , objs[2] , text)
                })
            }
            else{
                text = "<b> Ops seems like i could't find anything 🙁 \nTry searching just your city name </b>" 
                sendResponse(objs[1] , objs[2] , text)
            }
        })
    }
}
setInterval(wrapUp , 2000) 
