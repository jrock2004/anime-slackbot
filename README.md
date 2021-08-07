# anime-slackbot

A slash command bot that can be used for integrating with slack

[![Netlify Status](https://api.netlify.com/api/v1/badges/6141b4ee-0a99-4610-9a42-43370b1fd37c/deploy-status)](https://app.netlify.com/sites/anime-slackbot/deploys)

## Screenshots

**What it will looks like in Slack**
![A sample of what the output will look like in slack](image-slack-screenshot.png?raw=true)

**What it will look like in markdown**
![A sample of what the output will look like in markdown](image-markdown-screenshot.png?raw=true)

## API Documentation

### anime

**POST** - /anime

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| text\* | string | The name of the anime you want to look up. *Ex. One Piece* |
| response\_url\* | *slack \| markdown* as string | Either of these 2 values are required. If you pass something else the code will just default to slack |
| token\* | string | Used to auth to the API |

Possible responses - Format `application/json`

<table>
<tr>
<td> Status </td> <td> Response </td>
</tr>
<tr>
<td> 200 </td>
<td>

```json
{
  "text": "string",
  "response_type": "response"
}
```
</td>
</tr>
<tr>
<td> 400 </td>
<td>

```json
{
  "message": "string"
}
```
</td>
</tr>
</table>

## Local Development

Its pretty easy to check the code out and getting running. After cloning the repo, just run the following to start the server

```sh
npm install
npm run dev
```

This will start the server up locally that will be running on `http://localhost:8888`. So now you can open your favorite app to make API calls and play around. If you are using something like [Postman](https://www.postman.com), you open a tab to call an API and fill in the following:

- Set it to POST
- Enter for url `http://localhost:8888/api/anime`
- Click on `Body` and set it to `x-www-form-urlencoded`

The key values that you need to enter are as follows

```
text=One Piece
response_url=slack
token=9999
```

See more information in the API documentation above

## Run this on Netlify

If you want to be able to use this code to have your own anime slash command, you can click the following button to deploy this code to your own Netlify. 

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jrock2004/anime-slackbot)

After this is deployed you will want to set up a new environment variable in Netlify called `TOKEN`. The value of the environment variable should be the string you want API callers to pass for the token parameter. For a slack slash command, it will generate a token for you. You should take that and put that in here so it works. After setting this you should re-deploy your netlify site for the changes to take effect.

## Anime Sources

This bot is making an API call to get its information from [https://anilist.co](https://anilist.co)
