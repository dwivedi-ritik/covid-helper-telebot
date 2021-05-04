const axios = require("axios")
const fs = require("fs")


async function fetchTweets(query) {
    //reading through config files
    let configData = fs.readFileSync("./config.json")
    let jsonConfig = JSON.parse(configData)
    let bearerToken = jsonConfig["bearer_token"] 
    let allHashtags = "#verified"
    let res = await axios({
        method:"get",
        url:"https://api.twitter.com/1.1/search/tweets.json",
        headers : {"Authorization" : "Bearer "+bearerToken},
        params : {
            "q":`${allHashtags} ${query}`, "result_type":"recent" , "count":100 , "tweet_mode":"extended"
        }
    })
    return res.data
}

async function filterTweets(query) {
    let resultObj = []
    let duplicate = new Set()
    let jsonResData = await fetchTweets(query)
    for (data of jsonResData["statuses"]) {
        if ("retweeted_status" in data) {
            text = data["retweeted_status"]["full_text"]
            if (!(duplicate.has(text))){ 
                duplicate.add(text)
                resultObj.push({
                    "text": data["retweeted_status"]["full_text"],
                    "user_name": data["retweeted_status"]["user"]["screen_name"],
                    "tweet_link":`https://www.twitter.com/${data["retweeted_status"]["user"]["screen_name"]}/status/${data["retweeted_status"]["id_str"]}`
                }) 
            }
        }
    }
    return resultObj

}

module.exports = filterTweets