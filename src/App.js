import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokens, setTokens] = useState([]);
  const [prices, setPrices] = useState({});
  const [chartData, setChartData] = useState(null);

  // Supported chains
  const supportedChains = [
    { name: 'Ethereum', chainId: 1 },
    { name: 'Binance Smart Chain', chainId: 56 },
    { name: 'Arbitrum', chainId: 42161 },
    { name: 'Optimism', chainId: 10 },
    { name: 'Core', chainId: 1116 },
    { name: 'zkSync', chainId: 324 },
    { name: 'Polygon', chainId: 137 },
    { name: 'Celo', chainId: 42220 },
  ];

  useEffect(() => {
    if (walletAddress) {
      fetchTokensAndPrices(walletAddress);
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const fetchTokensAndPrices = async (address) => {
    const fetchedTokens = [];
    const fetchedPrices = {};

    // Simulate fetching tokens from chains (real implementation would use APIs)
    for (let chain of supportedChains) {
      const chainTokens = await mockFetchTokens(address, chain.chainId);
      fetchedTokens.push(...chainTokens);

      for (let token of chainTokens) {
        const price = await fetchTokenPrice(token.symbol);
        fetchedPrices[token.symbol] = price || 'No data found';
      }
    }

    setTokens(fetchedTokens);
    setPrices(fetchedPrices);
  };

  const fetchTokenPrice = async (symbol) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`
      );
      return response.data[symbol.toLowerCase()]?.usd;
    } catch (error) {
      return null;
    }
  };

  const mockFetchTokens = async (walletAddress, chainId) => {
    // Simulated token fetching (replace with actual token API calls)
    return [
      { name: 'Ethereum', symbol: 'ETH', balance: '1.234', chainId },
      { name: 'Binance Coin', symbol: 'BNB', balance: '2.567', chainId },
    ];
  };

  const showChart = (symbol) => {
    // Simulate chart data
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: `${symbol} Price`,
          data: [100, 200, 300, 250, 400, 500],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    };
    setChartData(data);
  };

  return (
    <div className="App">
      <h1>Crypto Portfolio</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Wallet Address: {walletAddress}</p>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Balance</th>
                <th>Price (USD)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={index}>
                  <td>{token.name}</td>
                  <td>{token.balance}</td>
                  <td>{prices[token.symbol] || 'No data found'}</td>
                  <td>
                    <button onClick={() => showChart(token.symbol)}>Show Chart</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {chartData && (
            <div>
              <h2>Token Chart</h2>
              <Line data={chartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
