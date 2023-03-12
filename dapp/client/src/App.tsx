import React from 'react';
import { Layout, Row, Col, Button, Input } from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import nlp from 'compromise';
import { GptCaller } from "./sdk/gptCaller.sdk.js";
import { AptosClient } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./components/Main";
import History from "./components/History";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);
const moduleAddress = "0x6507124baa17047bf6988f03188fa7fd8c6d508c1007e7085882a8544a4a6b76";
const { TextArea } = Input;

type MyStuff = {
  text: string,
  isUser: boolean,
}

function Summarize() {
  const [text, setText] = useState('Hwllo');
  const [inputValue, setInputValue] = useState<string>('');
  const x = inputValue;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

    function textTrim(text: string): string {
      const par_pattern = /\([^()]*\)/g;
      const trimmedText = text.replace(par_pattern, '')
                              .replace(/\s*([.,;:!?"])/g, "$1")
                              .replace(/\t/g, " ")
                              .replace(/\n/g, " ")
                              .replace(/\n\n/g, " ")
                              .replace(/  /g, " ")
                              .replace(/"/g, "");
      return trimmedText;
    }

  function removeAdjectives(text: string) {
    const doc = nlp(text);
    doc.delete(doc.adjectives());
    const no_text_adj = doc.out('text');
    return no_text_adj
  }

  function textPrep(text: string) {
    const text_1 = textTrim(text);
    const text_2 = removeAdjectives(text_1);
    return text_2
  }
  
  const cleanText = textPrep(x);
  
  const str = "To simplfy, "
  const gpt_prompt = cleanText + "\n" + str;

  // each mesage format: {text: "message", isUser: true/false}
const [messages, setMessages] = useState<MyStuff[]>([]);
const [requestText, setRequestText] = useState("");
const [isRequesting, setIsRequesting] = useState(false);

function sendRequest(e: React.FormEvent<HTMLFormElement>): void {
  e.preventDefault();
  setIsRequesting(true);
  GptCaller.askChatGPT(requestText)
    .then((response: string) => {
      setMessages([
        {
          text: requestText,
          isUser: false
        },
        {
          text: response,
          isUser: false
        }
      ]);
      setRequestText("");
      setIsRequesting(false);
    })
    .catch((err: Error) => {
      console.log(err);
      setIsRequesting(false);
    });
}

//  const { Configuration, OpenAIApi } = require("openai");
//
//  const configuration = new Configuration({
//    apiKey: process.env.OPENAI_API_KEY,
//  });
//  const openai = new OpenAIApi(configuration);
//
//  const response = openai.createCompletion({
//  model: "text-davinci-003",
//  prompt: gpt_prompt,
//  temperature: 0.9,
//  max_tokens: 300,
//  top_p: 1,
//  frequency_penalty: 0,
//  presence_penalty: 0,
//});

  const handleButtonClick = () => {
    setText(cleanText);
  }
  return (

    <div>
      <Col>
      <div style={{ margin: '24px 0' }} />
      <input type="text" value={inputValue} onChange={handleInputChange} />

        <Row>
            <Button onClick={handleButtonClick} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
                Summarize
            </Button>
            <p>{text}</p>
            <Button  block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
                Approve
            </Button>
        </Row>
      </Col>
    </div>
  );
}

function App() {
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);


  const fetchList = async () => {
    if (!account) return [];
    try {
      const TodoListResource = await client.getAccountResource(
        account.address,
        `${moduleAddress}::summaraize::SummaryList`
      );
      setAccountHasList(true);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };

  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::summaraize::create_list`,
      type_arguments: [],
      arguments: [
      ],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await client.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const addSummary = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::summaraize::create_summary`,
      type_arguments: [],
      arguments: [
        'test',
        'test',
        'test'
      ],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await client.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, [account?.address]);

  
  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>SummarAIze</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
              <WalletSelector />

            </Col>
          </Col>
        </Row>
      </Layout>
        {!accountHasList && (
        <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
          <Col span={8} offset={8}>
            <Router>
                  <Routes>
                    <Route path="/summarize" element={<Summarize />}/>
                    <Route path="/history" element={<History />}/>
                    <Route path="/" element={<Main/>}/>
                  </Routes>
                </Router>
                <Button onClick={addNewList} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
                  Add new list
                </Button>
                <Button onClick={addSummary} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
                  add summary
                </Button>
          </Col>
        </Row>
        )}
    </>
  );
}

export default App;
