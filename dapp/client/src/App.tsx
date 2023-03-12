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
const moduleAddress = "0x6507124baa17047bf6988f03188fa7fd8c6d508c1007e7085882a8544a4a6b76";

function App() {
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);

  const fetchList = async () => {
    if (!account) return [];
    try {
      const TodoListResource = await client.getAccountResource(
        account.address,
        `${moduleAddress}::summaraize::Summaraize`
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
      arguments: [],
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
          </Col>
        </Row>
        )}
    </>
  );
}

export default App;
