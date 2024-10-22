import Image from "next/image";
import { FaCheckDouble, FaBan } from "react-icons/fa6";
import PredictionCard from '../components/predictionCard';
import PredictionsList from '../components/PredictionsList';

const contractAddress = '0x2382c2f795D233B909552D5B4Ed75f9368F17F77'; // Your contract address
const abi = [ /* ABI JSON array here */ ]; // Your contract's ABI

const Market = () => {
  return (
    <div>
      <section className="text-gray-600 body-font max-w-5xl">
        <div className="container max-sm:px-5 py-10 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <Image
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://dummyimage.com/720x400"
                  alt="blog"
                  width={300}
                  height={300}
                />
                <div className="p-6 ">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                    Who will win the 2025 Uefa Champions League?
                  </h1>

                  <div className="flex justify-between">
                    <span className="mt-1">Man City</span>
                    <div className="flex gap-2">
                      <span className="flex gap-2 bg-slate-300 rounded-lg p-1">
                        Yes <FaCheckDouble className="mt-1" />
                      </span>
                      <span className="flex gap-2 bg-slate-300 rounded-lg p-1">
                        No <FaBan className="mt-1" />
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="">20k KAIA Staked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PredictionCard contractAddress={contractAddress} abi={abi} />
        <PredictionsList contractAddress={contractAddress} abi={abi} />
      </div>
      </section>
    </div>
  );
};

export default Market;
