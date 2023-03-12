import React from 'react';
import { Layout, Row, Col, Button } from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { AptosClient } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";

import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Summarize from "./components/Summarize";
import Main from "./components/Main";
import History from "./components/History";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

function App() {
  const { account } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const fetchList = async () => {
    if (!account) return [];
    // change this to be your module account address
    const moduleAddress = "0xcbddf398841353776903dbab2fdaefc54f181d07e114ae818b1a67af28d1b018";
    try {
      const TodoListResource = await client.getAccountResource(
        account.address,
        `${moduleAddress}::todolist::TodoList`
      );
      setAccountHasList(true);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };

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
        </Col>
      </Row>
    )}
    </>
  );
}

export default App;
