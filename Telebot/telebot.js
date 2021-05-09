const axios = require("axios")
const fs = require("fs")

//reading through config files
let configData = fs.readFileSync("./config.json")
let jsonConfig = JSON.parse(configData)
let botToken = jsonConfig["bot_token"] 
const TELEBOTURL = `https://api.telegram.org/bot${botToken}`
const greetTxt = `<b>Hello send me your city name with requirements 🙂</b>`
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
async function getBotUpdate(UPDATEID) {
    let updateUrl = `${TELEBOTURL}/getUpdates`
    let requestObj = {
        method:"get",
        url : updateUrl,
        params : {"timeout":100 , "offset":UPDATEID}
    }

    let botUpdate = await axios(requestObj)
    console.log("Getting called")

    let updates = botUpdate.data["result"] 

    if (updates.length != 0) {
        let allUpdates = []
        updates.forEach(obj=>{
            if(!("message" in obj)){
                allUpdates.push({
                    "update_id":obj["update_id"],
                    "msg":false
                })
            }else{
                allUpdates.push({
                    "update_id":obj["update_id"],
                    "usrTxt":obj["message"]["text"],
                    "usrId":obj["message"]["chat"]["id"],
                    "msgId":obj["message"]["message_id"],
                    "msg":true
                })
            }
        })
        return allUpdates
    }
    return false
}

module.exports = { getBotUpdate , sendResponse }  
