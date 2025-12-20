import React from 'react';

// Import components one by one to test
// import { Header } from './components/Header';
// import { Footer } from './components/Footer';
// import LandingView from './views/LandingView';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#0071e3' }}>Clean Up Bros - Loading...</h1>
      <p>Basic app structure working</p>

      {/* Uncomment one by one to test: */}
      {/* <Header navigateTo={() => {}} /> */}
      {/* <Footer navigateTo={() => {}} /> */}
      {/* <LandingView navigateTo={() => {}} /> */}
    </div>
  );
};

export default App;
