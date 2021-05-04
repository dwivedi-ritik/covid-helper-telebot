const axios = require("axios")
const fs = require("fs")

//reading through config files
let configData = fs.readFileSync("./config.json")
let jsonConfig = JSON.parse(configData)
let botToken = jsonConfig["bot_token"] 
const TELEBOTURL = `https://api.telegram.org/bot${botToken}`
// let UPDATEID = jsonConfig["update_id"]
let UPDATEID

//function for sending message to user
async function sendResponse(chatId ,msgId , msg) {
    let messageUrl = `${TELEBOTURL}/sendMessage` 
    let messageUpdate = await axios({
        method:"get",
        url:messageUrl,
        params:{"chat_id":chatId , "text":msg , "reply_to_message_id":msgId , "parse_mode":"HTML"}
    })
    return messageUpdate.data["ok"] 
}

//Function for getting latest updates from bot end
async function getBotUpdate(msg) {
    let updateUrl = `${TELEBOTURL}/getUpdates`
    let botUpdate = await axios({
        method:"get",
        url : updateUrl,
        params : {"timeout":80}
    })
    let updates = botUpdate.data["result"] 
    if (updates.length != 0) {
        let lastIndex = botUpdate.data["result"].length-1
        let usrTxt = updates[lastIndex]["message"]["text"]
        let usrId = updates[lastIndex]["message"]["chat"]["id"]
        let msgId = updates[lastIndex]["message"]["message_id"]
        
        if (updates[lastIndex]["update_id"] != UPDATEID ) {
            UPDATEID = updates[lastIndex]["update_id"]
            return [usrTxt , usrId , msgId]
        }
    }
    return false
}

module.exports = { getBotUpdate , sendResponse }    
