import PredictionCard from './predictionCard';
import PredictionsList from './PredictionsList';
import abi from '../utils/PredictionMarket.json';

const contractAddress = '0x2382c2f795D233B909552D5B4Ed75f9368F17F77'; // Your contract address

const Market = () => {
  return (
    <div>
      <section className="text-gray-600 body-font max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PredictionCard contractAddress={contractAddress} abi={abi} />
        <PredictionsList contractAddress={contractAddress} abi={abi} />
      </div>
      </section>
    </div>
  );
};

export default Market;
