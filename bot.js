const filterTweets = require("./twitterapi/tweetfetch")
const { getBotUpdate , sendResponse } = require("./Telebot/telebot")
let UPDATEID = 0

async function wrapUp() {
    let botUpdates = await getBotUpdate(UPDATEID)
    if(botUpdates){
        UPDATEID = botUpdates[botUpdates.length - 1]["update_id"] + 1
        botUpdates.forEach((obj) =>{
            filterTweets(obj["usrTxt"]).then(tweetRes =>{
                if(!tweetRes.length){ 
                    let opsTxt = "<b>Sorry but seems like I could't find any tweets 🙁</b>"
                    sendResponse(obj.usrId , obj.msgId ,  opsTxt)
                }else{
                    tweetRes.forEach(res=>{
                        text = `<strong>Tweet Link 👉 <a href='${res["tweet_link"]}'> ${res["user_name"]}</a></strong>\n\n<b> ${res["text"]}</b>`
                        sendResponse(obj.usrId , obj.msgId , text)
                    })
                }
            })
        })
    }
}
//This condition is used for running a asynchronous function infinelty
//Using setInterval will crash the bot because 
//setInterval does't give shi*t about promise :(
// credit - StackOverFLow 

async function runMe(){ 
    while(true){
        await wrapUp()
    }
}

runMe()
