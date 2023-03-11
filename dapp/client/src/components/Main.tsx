import { useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Button } from "antd";

function Main() {
    const navigate = useNavigate();
    
    const goToSecondsComp = () => {
    
      // This will navigate to second component
      navigate('/second'); 
    };
    const gotToSummarizeComp = () => {
    
      // This will navigate to Summarize component
      navigate('/summarize'); 
    };

    const gotToHistoryComp = () => {
    
        // This will navigate to Summarize component
        navigate('/history'); 
      };
    
    return (
      <div className="App">
        <header className="App-header">
          <p> components</p>
          <Col>
            <Button onClick={gotToSummarizeComp} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
            Start
            </Button>
            <Button onClick={gotToHistoryComp} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
                View History
            </Button>
          </Col>
        </header>
      </div>
    );
  }
    
  export default Main;