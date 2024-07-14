# 🤖 AGENTPLATFROM

## Introduction

This repository is a Hackathon project. It was entirely coded during [ETHGlobal Brussels](https://ethglobal.com/events/brussels).

Goal : Bringing transparency in politics by analyzing past votes of a MEP (Member of the European Parliament). The analysis is done by an AI Agent, running in a Trusted Execution Environment (TEE), to guarantee that it brings no biais other than the ones natives to Large Language Models (LLMs).

Everything in this project is Open Source - from the data to the final output, guaranteeing a maximal transparency. 

## 📊 Data
The data is retrieved from the [Open Data Portal](https://data.europarl.europa.eu/en/developer-corner/opendata-api) maintained by the Europen Parliament 🇪🇺. 
The data is not well structured, so we had to use differents methods.

#### API

There is an API ([`https://data.europarl.europa.eu/api/v2/`](https://data.europarl.europa.eu/api/v2/)) that was used to retrieve : 

- all plenary meetings of a year,
- all the things that were voted during this session (title, documents, resolutions, … but **not** the individual votes of each MEP, nor the results of the votes),
- the title of a documents, based on its ELI id

#### Other sources

[`https://www.europarl.europa.eu/doceo/document//{file_id}_EN.pdf`]() allows to get a file, in the English version, based on its id (e.g. a Directive or a Report)

[`https://www.europarl.europa.eu/doceo/document/{plenary_session_id}-RCV_EN.xml`](https://www.europarl.europa.eu/doceo/document/%7Bfile_id%7D-RCV_EN.xml) allows to get an XML file containing all votes of a planary session. 

In the XML file, we can find the votes of each individual MEP (”for”, “against”, or “abstention”) for each voting of the session. 

By merging the data retrieved from the API with the associated votes results, we can get find who voted for what.

The data is stored in the `retrieve_data/data` directory.
The instruction to retrieve the data are described in `retrieve_data/readme.md`.

## 🤖 AI Agent
The AI Agent is running on the blockchain [Galadriel 🧙](https://docs.galadriel.com/reference/overview). It works as follows : 
- User select a politician (s)he wants to review
- the Agent reviews the historic of votes of this politician
- The Agent call an LLM Oracle with this historical data
- The user receives the LLM's response

Why do we use *on-chain* LLM ❓ We could simply make this Agent off-chain on a server calling ChatGPT using directly an OpenAI key, right ? 
Well, politics is a sensitive topic.  Similarly to a journalist that could influence its readers with a biaised point of view, we could train or influence our Agent to respond with a biaised answer. The use of Galadriel's blockchain allows us to be transparent regarding the use of our Agent. Indeed, Galadriel's Oracle is running on a Trusted Execution Environment (TEE), signing all transaction and proving that the execution is done without additional modification. More info on this on [their documentation](https://docs.galadriel.com/how-it-works). 

##  🖥️ User Interface
Next.js App

### Getting Started

#### Get the data
Follow the instructions in `retrieve_data/readme.md`.

#### Install and run the app
Clone this repository and go to the Next App directory 

```bash
git clone https://github.com/M-BenAli/AgentPlatform.git
cd AgentPlatform/src/app
```

Install the depencies 
```bash
npm install
```

run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Create a `.env.local` file and fill the necessary keys.

## Smart Contract
Install a wallet (e.g. [Metamask](https://metamask.io/))

Get some GAL tokens : [Faucet](https://docs.galadriel.com/faucet)

Adress of the AI Agent : `0xb040D6aedc4E77A1f904F415ad6Ca983244818b4`

Adress of the Oracle : `0x68EC9556830AD097D661Df2557FBCeC166a0A075`

View on Galadriel's explorer : [explorer.galadriel.com/address/0xb040D6aedc4E77A1f904F415ad6Ca983244818b4](https://explorer.galadriel.com/address/0xb040D6aedc4E77A1f904F415ad6Ca983244818b4)

