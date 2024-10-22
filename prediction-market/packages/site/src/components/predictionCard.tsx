import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@kaiachain/ethers-ext'; // Use Kaia SDK Web3Provider

interface PredictionCardProps {
  contractAddress: string;
  abi: any;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ contractAddress, abi }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null); // Use signer directly
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [betAmount, setBetAmount] = useState<string>('0.01');
  const [outcome, setOutcome] = useState<number>(0); // 0 for OptionA, 1 for OptionB
  const [isOwner, setIsOwner] = useState(false);

  // Use Kaia SDK's Web3Provider to connect to MetaMask
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Provider = new Web3Provider(window.ethereum, 'any'); // Using Kaia SDK's Web3Provider
      setProvider(web3Provider);
    }
  }, []);

  useEffect(() => {
    if (provider) {
      // Use the provider to get the signer (user wallet)
      provider.send('eth_requestAccounts', []).then(async () => {
        const signer = provider.getSigner();
        setSigner(signer);

        const contract = new ethers.Contract(contractAddress, abi, signer); // Use the signer directly
        setContract(contract);

        // Check if user is the owner
        const ownerAddress = await contract.owner();
        const userAddress = await signer.getAddress(); // Get address directly from the signer
        setIsOwner(ownerAddress.toLowerCase() === userAddress.toLowerCase());
      });
    }
  }, [provider, abi, contractAddress]);

  const placePrediction = async () => {
    if (!contract || !signer) return;

    try {
      const tx = await contract.placePrediction(outcome, {
        value: ethers.utils.parseEther(betAmount),
      });
      await tx.wait();
      alert('Prediction placed!');
    } catch (error) {
      console.error('Error placing prediction:', error);
    }
  };

  const revealOutcome = async () => {
    if (!contract || !signer || !isOwner) return;

    try {
      const tx = await contract.revealOutcome(outcome); // Only the owner can reveal
      await tx.wait();
      alert('Outcome revealed!');
    } catch (error) {
      console.error('Error revealing outcome:', error);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h2 className="text-lg font-semibold">Prediction Market</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="betAmount" className="block text-sm font-medium">
            Bet Amount (KAIA)
          </label>
          <input
            type="number"
            id="betAmount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="outcome" className="block text-sm font-medium">
            Choose Outcome
          </label>
          <select
            id="outcome"
            value={outcome}
            onChange={(e) => setOutcome(Number(e.target.value))}
            className="border rounded-md p-2 w-full"
          >
            <option value={0}>Option A</option>
            <option value={1}>Option B</option>
          </select>
        </div>

        <button
          onClick={placePrediction}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Place Prediction
        </button>

        {isOwner && (
          <button
            onClick={revealOutcome}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Reveal Outcome (Owner Only)
          </button>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
