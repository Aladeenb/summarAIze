import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Button, Input } from "antd";
import { useNavigate } from 'react-router-dom';
import nlp from 'compromise';
import { GptCaller } from "./sdk/gptCaller.sdk.ts";
import "./App.css";

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
      <header>
        <p>Summarize components</p>
  
        <Link to="/">go back</Link>
      </header>
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
  
export default Summarize;