import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Button, Input } from "antd";
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

function Summarize() {

  const [inputValue, setInputValue] = useState<string>('');
  const x = inputValue;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };



  function Summary() {
    //console.log(x);
    //console.log("____________");
    console.log(textPrep(x));
    const new_x = textPrep(x);
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
      <p>You typed: {inputValue}</p>
        <Row>
            <Button onClick={Summary} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
                Summarize
            </Button>
        </Row>
      </Col>
    </div>
  );
}
  
export default Summarize;