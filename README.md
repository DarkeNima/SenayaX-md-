


<div align="center"> 
</p>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=37&pause=1000&color=F722F2&width=435&lines=QUEEN+SENAYA+MD+V2)](https://git.io/typing-svg)



<div class = "repo" align = "center">
 
<a href = "#">
<img src = "https://github.com/Naviyaoficiall/newsbot/raw/refs/heads/main/images/file-22Kux4CDW2p4juY2nxq3cG.webp"  width="800" height="500">
</img>



</a>
</div>
<br>
<br>
<br>
<p align="center">
<a href="#"><img title="Creator" src="https://img.shields.io/badge/Creator-Naviyaoficiall-purple.svg?style=for-the-badge&logo=github"></a>
</p>
<p align="center">
<a href="https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/DarksadasYT1/DARK-SHUTER-MD-V2?color=blue&style=flat-square"></a>
<a href="https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2/network/members"><img title="Forks" src="https://img.shields.io/github/forks/DarksadasYT1/DARK-SHUTER-MD-V2?color=yellow&style=flat-square"></a>
<a href="https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2/watchers"><img title="Watching" src="https://img.shields.io/github/watchers/DarksadasYT1/DARK-SHUTER-MD-V2?label=Watchers&color=red&style=flat-square"></a>
<a href="https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2/"><img title="Size" src="https://img.shields.io/github/repo-size/AlipBot/Api-Alpis?style=flat-square&color=darkred"></a>
<a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2/%2Fhit-counter&count_bg=%2379C83D&title_bg=%23555555&icon=probot.svg&icon_color=%2304FF00&title=hits&edge_flat=false"/></a>
<a href="https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2/graphs/commit-activity"><img height="20" src="https://img.shields.io/badge/Maintained-No-red.svg"></a>&nbsp;&nbsp;
</p> 





*👨‍🔧 A WhatsApp based third party application that provide many services with a real-time automated conversational experience.*



 `Release date : ` _2024-11-29_ | 
 `Last update : ` _2024-12-14_ |
 `Last version : ` _2.0.2_ |

</div>

## || GET SESSION 💃

***[GET SESSION SERVER 01](https://hyper-hackers-connection-kushansewmina789.koyeb.app)***
<br>
<br>
***[GET SESSION SERVER 02](https://session-hyper-hackers.vercel.app/)***
<br>
<br>
***[ALL SERVERS NOT WORKING CLICK HERE](https://session-hyper-hackers.vercel.app/qr-dark-shutter-md)***

## || DEPLOYMENT PLATFORMS 💃

<br>

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/apps/deploy?type=git&repository=github.com/DarksadasYT1/DARK-SHUTER-MD-V2&branch=main&env[SESSION_ID]&env[GITHUB_USERNAME]&env[GITHUB_AUTH_TOKEN]&name=Dark-shuter)
<br>

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)
<br>

[![Deploy on heroku](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?button-url=https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2&template=https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2.git)

<br>

  
<a href="https://github.com/DarksadasYT1/DARK-SHUTER-MD-V2/fork" target="blank"><img align="center" src="https://i.imgur.com/cxaSEWe.png" alt="fork dark-shuter" height="65" width="170" /></a>



<hr>

<b>WORKFLOW CODE</b></br>
```
name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: npm install

    - name: Start application
      run: npm start
