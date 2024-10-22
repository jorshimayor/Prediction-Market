import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@kaiachain/ethers-ext';

interface PredictionsListProps {
  contractAddress: string;
  abi: ethers.ContractInterface;
}

const PredictionsList: React.FC<PredictionsListProps> = ({ contractAddress, abi }) => {
  interface Prediction {
    participant: string;
    prediction: {
      predictedOutcome: number;
      amountWagered: ethers.BigNumber;
    };
  }

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Provider = new Web3Provider(window.ethereum, 'any');
      setProvider(web3Provider);
    }
  }, []);

  useEffect(() => {
    if (provider) {
      // Use the provider to get the signer (user wallet)
      provider.send('eth_requestAccounts', []).then(async () => {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
      });
    }
  }, [provider, abi, contractAddress]);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!contract) return;

      // You will need to implement fetching participants and predictions from the contract.
      // Example pseudocode (you need to adapt this based on your contract):
      const participants: string[] = []; // Fetch participants from your contract
      const allPredictions: Prediction[] = [];

      for (const participant of participants) {
        const prediction = await contract.predictions(participant);
        allPredictions.push({ participant, prediction });
      }

      setPredictions(allPredictions);
    };

    fetchPredictions();
  }, [contract]);

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h2 className="text-lg font-semibold">Predictions</h2>
      <ul className="space-y-4">
        {predictions.map((item, index) => (
          <li key={index} className="p-2 border rounded-md">
            <p><strong>Participant:</strong> {item.participant}</p>
            <p><strong>Prediction:</strong> {item.prediction.predictedOutcome === 0 ? 'Option A' : 'Option B'}</p>
            <p><strong>Amount Wagered:</strong> {ethers.utils.formatEther(item.prediction.amountWagered)} ETH</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PredictionsList;
