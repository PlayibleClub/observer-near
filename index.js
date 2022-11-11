//require("dotenv").config();
const { w3cwebsocket }  = require( "websocket");
const client = new w3cwebsocket("wss://events.near.stream/ws");
// Modify by the game account id
let account_id = "token.sweat";

let standard = "game";
let event = "lineup_submission_result";

let interval = ''
function observer() {
    client.onopen = async () => {
        clearInterval(interval)
        console.log('WebSocket Client Connected');
        client.send(JSON.stringify({
            // not sure about the secret key but it is from the docs and working
            secret: "ohyeahnftsss",
            filter: [{
                "account_id": account_id,
                "status": "SUCCESS",
                "event": {
                    "standard": standard,
                    "event": event,
                }
            }],
            fetch_past_events: 0,
        }))
    };


    client.onmessage = (message) => {
        let to_json = JSON.parse(message.data)
        let events = to_json.events
        // TODO: i invite you to use PUSHER.com to send websocket info from the backend to the frontend to get a realtime Dapp
        events.forEach(e => {
            console.log(e)
            console.log(e.event.data[0].result)
            let data = e.event.data[0];
            if (data.result == "success"){
                // TODO: Save following game info into the database
                // block height
                console.log(e.block_height)
                // save the game id
                console.log(data.game_id)
                // team name
                console.log(data.team_name)
                // signer
                console.log(data.signer)
                // lineup
                console.log(data.lineup)

            }
            else if (e.event.data[0].result == "failure"){
                // TODO: In case we want to show notification on frontend the TX failed
                console.error("Data failed to insert")
            }else {
                console.error("Error result not found")
            }

        })
    }

    client.onclose = function(e) {
        //console.log('websocket closed. reopening...');
        interval = setInterval(function() {
            observer();
        }, 5000);
        //console.log("interval")
        //console.log(interval)
    };

    client.onerror = function() {
        console.log('Connection Error');
        client.close()
    };

    setInterval(function() {
        if (!client.readyState){
            observer();
            //console.log("Retry observe")
        }

        //console.log("Observing")
    }, 5000);

}
//observer()
exports.observers = observer
