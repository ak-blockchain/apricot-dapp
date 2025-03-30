
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.10.0/+esm';

const DECIMALS = 5;
const contractAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const pairAddress = "0xC39B991A42A961eEB390059a82A337D84e68afB7";
const marketingWallet = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"

var userAddress; 
var mainContract; 

let provider;
let signer;

var days = 1; 

let sharedValues = {
	price: 0,
	yourBalance: 0,
	apy: 400977
}

function linkButtons() {
    document.getElementById("walletCircle").onclick = loginManual;
    document.getElementById("copyToken").onclick = copyToken;
    document.getElementById("copyPair").onclick = copyPair;

    document.getElementById("btn_docs").onclick = goToPage;

	document.getElementById("btn_account").onclick = enterAccount;
	document.getElementById("btn_menu").onclick = enterHomepage;
	document.getElementById("btn_calc").onclick = enterCalculator;
	//document.getElementById("btn_flooz").onclick = enterFlooz;

}

function copyToken() {
    document.getElementById("tokenClipboard").style = "visibility: hidden";
    document.getElementById("tokenTick").style = "visibility: visible";

    setTimeout(function(){ 
        document.getElementById("tokenClipboard").style = "visibility: visible";
        document.getElementById("tokenTick").style = "visibility: hidden";
     }, 500);
     navigator.clipboard.writeText(contractAddress);
}

function copyPair() {
    document.getElementById("pairClipboard").style = "visibility: hidden";
    document.getElementById("pairTick").style = "visibility: visible";

    setTimeout(function(){ 
        document.getElementById("pairClipboard").style = "visibility: visible";
        document.getElementById("pairTick").style = "visibility: hidden";
     }, 500);
     navigator.clipboard.writeText(pairAddress);
}

function goToPage() {
    window.open(
        "https://overpowered.finance", "_blank");
}

function beautifyAddress(address, first) {
    return address.slice(0, first)+"..."+address.slice(-3);
}

function updateUserAddress(ethAddress) {
    userAddress = ethAddress;
    document.getElementById("usersWallet").innerHTML = beautifyAddress(ethAddress,5);
}

async function loginManual() {
   await logOut();
   await login();
}

async function login() {
    if (!window.ethereum) {
		alert("Please install MetaMask!");
		return;
	  }
	
	  // Connect to MetaMask
	  provider = new ethers.BrowserProvider(window.ethereum);
	  signer = await provider.getSigner();
	
	  const address = await signer.getAddress();
	  console.log("Connected wallet:", address);
	
	  // Optional: switch to BSC Mainnet (chainId 0x38)
	  const bscChainId = "0x38";
	
	  const currentNetwork = await provider.getNetwork();
	  if (currentNetwork.chainId !== parseInt(bscChainId, 16)) {
		try {
		  await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: bscChainId }],
		  });
		} catch (switchError) {
		  console.error("Failed to switch network:", switchError);
		  alert("Please switch to Binance Smart Chain manually.");
		  return;
		}
	  }
	
	  updateUserAddress(address);
	  getStats();
}

async function logOut() {

	// Reset global variables if needed
	provider = null;
	signer = null;

	// Optional: reset your UI
	console.log("User logged out.");    console.log("logged out");
  }
 
async function getStats() {
    var contract = await new ethers.Contract(contractAddress, abi, provider);
	let circulatingSupply = await contract.totalSupply();
	console.log("Circulating Supply "+circulatingSupply)

	const priceOptions = {
		address: contractAddress,
		chain: "bsc",
		exchange: "PancakeSwapv2",
	  };
	 //const price = await Moralis.Web3API.token.getTokenPrice(priceOptions);
	 const price = 1;

    //await getRewards();
	
	//let treasuryReceiver = await contract.treasuryReceiver();
	let treasuryBalance = await contract.balanceOf(marketingWallet);
	console.log("treasury balance  "+treasuryBalance)

	let valueOfTreasury = 1 
	let marketCap = 1

	//let firePit = await contract.thunderDome();
	//let firePitBalance = await contract.balanceOf(firePit);
	let firePitBalance = 0; 
	let valueOfFirePit = 0; 
	//let valueOfFirePit = firePitBalance*price.usdPrice; 

	//let pair = await contract.pair();
	
	const lpOptions = {
		pair_address: pair,
		chain: "bsc",
	};

	const LPReserves = 0//await Moralis.Web3API.defi.getPairReserves(lpOptions);
	const BNBReserves = 0 //LPReserves['reserve0'];
	
	sharedValues['price'] = 1
	
	updateFrontend(
		ethers.formatUnits(circulatingSupply, 18),
		ethers.formatUnits(valueOfTreasury, 18),
		ethers.formatUnits(marketCap, 18),
		ethers.formatUnits(firePitBalance, 18),
		ethers.formatUnits(valueOfFirePit, 18),
		0,
		(BNBReserves/(10**18)*380).toFixed(0)
		);
		setupCountdown();
	updateCalcFrontend()

}


function setupCountdown() {
	
	var coeff = 1000 * 60 * 15;
	var countDownDate = new Date();
	countDownDate = new Date(Math.round(countDownDate.getTime() / coeff) * coeff)

	var x = setInterval(function() {

		// Get today's date and time
		var now = new Date().getTime();
	  
		// Find the distance between now and the count down date
		var distance = countDownDate - now;
	  
		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	  
		// Display the result in the element with id="demo"
		let rebaseElements = document.getElementsByClassName("rebaseCountdown");
		console.log("rebase"+rebaseElements)
		for(var i=0; i<rebaseElements.length; i++) {
			rebaseElements[i].innerHTML = "00" + ":" + ('0' + minutes).slice(-2) + ":" + ('0' + seconds).slice(-2);
		}
	  
		// If the count down is finished, write some text
		if (distance < 0) {
			countDownDate = new Date(Math.round(countDownDate.getTime() / coeff) * coeff+coeff)
		}
	  }, 1000);
}


function updateFrontend(circulatingSupply,treasuryValue,marketCap, firePitBalance, valueOfFirePit, percentageFirePit, LPValue) {
	document.getElementById("circulatingSupply").innerHTML = truncateDecimals(circulatingSupply).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	document.getElementById("tokenPrice").innerHTML = "$"+sharedValues['price'];
	document.getElementById("treasuryValue").innerHTML = "$"+truncateDecimals(treasuryValue).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	document.getElementById("marketCap").innerHTML =  "$"+truncateDecimals(marketCap).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	document.getElementById("firePitBalance").innerHTML = truncateDecimals(firePitBalance,0);
	document.getElementById("firePitValue").innerHTML = "$"+truncateDecimals(valueOfFirePit).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	document.getElementById("percentFirePit").innerHTML = percentageFirePit+"%"
	document.getElementById("poolValue").innerHTML = "$"+LPValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function truncateDecimals(str, decimals = 2) {
	const [whole, fraction = ""] = str.split(".");
	return `${whole}.${fraction.slice(0, decimals).padEnd(decimals, "0")}`;
  }

async function getTokenBalance() {
    const options = { chain: 'bsc', address: "0xd51CB10cc1607e86A5def54EE3bE806A7df8528b"}
    const balances = await Moralis.Web3API.account.getTokenBalances(options);
}

function enterHomepage() {
	document.getElementById("homepage").style = "display: block;"
	document.getElementById("account").style = "display: none;"
	document.getElementById("calculator").style = "display: none;"
	//document.getElementById("flooz").style = "display: none;"
	
	document.getElementById("btn_menu").className = "menuButton menuButton_selected";
	document.getElementById("btn_account").className = "menuButton menuButton_clickable";
	document.getElementById("btn_calc").className =  "menuButton menuButton_clickable";
	//document.getElementById("btn_flooz").className =  "menuButton menuButton_clickable";

	//login(); 
}

function enterAccount() {
	document.getElementById("homepage").style = "display: none;"
	document.getElementById("account").style = "display: block;"
	document.getElementById("calculator").style = "display: none;"
	//document.getElementById("flooz").style = "display: none;"


	document.getElementById("btn_menu").className =  "menuButton menuButton_clickable";
	document.getElementById("btn_account").className = "menuButton menuButton_selected";
	document.getElementById("btn_calc").className =  "menuButton menuButton_clickable";
	//document.getElementById("btn_flooz").className =  "menuButton menuButton_clickable";

	setupCountdown();
	getAccountStats();
	
}

function enterCalculator() {
	document.getElementById("homepage").style = "display: none;"
	document.getElementById("account").style = "display: none;"
	document.getElementById("calculator").style = "display: block;"
	//document.getElementById("flooz").style = "display: none;"


	document.getElementById("btn_menu").className =  "menuButton menuButton_clickable";
	document.getElementById("btn_account").className = "menuButton menuButton_clickable";
	document.getElementById("btn_calc").className =  "menuButton menuButton_selected";
	//document.getElementById("btn_flooz").className =  "menuButton menuButton_clickable";

	updateCalcFrontend(); 
	updateSlider(1);
}

function enterFlooz() {
	document.getElementById("homepage").style = "display: none;"
	document.getElementById("account").style = "display: none;"
	document.getElementById("calculator").style = "display: none;"
	document.getElementById("flooz").style = "display: block;"

	document.getElementById("btn_menu").className =  "menuButton menuButton_clickable";
	document.getElementById("btn_account").className = "menuButton menuButton_clickable";
	document.getElementById("btn_calc").className =  "menuButton menuButton_clickable";
	document.getElementById("btn_flooz").className =  "menuButton menuButton_selected";
}

async function getAccountStats() {
	var contract = await new ethers.Contract(contractAddress, abi, provider);
    let tokenBalance = await contract.balanceOf(userAddress);
	let nextRewardAmount = 0.0235*tokenBalance;
	let nextRewardUSD = nextRewardAmount*parseFloat(sharedValues["price"]);
	sharedValues['yourBalance'] = parseFloat(tokenBalance)/(10**5); 
	updateAccountFrontend(tokenBalance,nextRewardAmount, nextRewardUSD);
}

function updateAccountFrontend(tokenBalance,nextRewardAmount, nextRewardUSD) {
	document.getElementById("yourBalance").innerHTML = parseFloat(tokenBalance)/(10**DECIMALS);  
	document.getElementById("accountPrice").innerHTML = "$"+sharedValues['price']
	document.getElementById("accountNextReward").innerHTML = parseFloat(nextRewardAmount)/(10**7);
	document.getElementById("accountNextUSD").innerHTML = "$"+parseFloat(nextRewardUSD)/(10**7);;
}

function updateCalcFrontend() {
	document.getElementById("calcPrice").innerHTML = "$"+sharedValues['price'];
	document.getElementById("calcAPY").innerHTML = sharedValues['apy']+"%";
	document.getElementById("calcBalance").innerHTML = sharedValues['yourBalance'];
	document.getElementById("tokenPriceInput").value = ""+sharedValues['price'];
	document.getElementById("tokenPriceFutureInput").value = ""+sharedValues['price'];
	document.getElementById("tokenAmountInput").value = ""+Math.max(10,sharedValues['yourBalance']);

}

function updateSlider(value) {
	if(value != -1) {
		days = ((value*3.68).toFixed(0)-3);
	}
	document.getElementById("selectedRange").innerHTML = days+" days";
	let tokens = document.getElementById("tokenAmountInput").value;
	let apy = document.getElementById("apyInput").value;
	let initialPrice = document.getElementById("tokenPriceInput").value;
	let futurePrice = document.getElementById("tokenPriceFutureInput").value; 

	document.getElementById("calc_initial").innerHTML = "$"+(tokens*initialPrice).toFixed(2);
	let futureTokens = tokens*(1.0228**days)
	document.getElementById("calc_rewards").innerHTML = futureTokens.toFixed(2);
	document.getElementById("calc_return").innerHTML = "$"+(futureTokens*futurePrice - tokens*initialPrice).toFixed(2); 
}

function maxAmount() {
	document.getElementById("tokenAmountInput").value = sharedValues['yourBalance'];
}
function currentAPY() {
	document.getElementById("apyInput").value = sharedValues['apy']+"%";
}
function currentPrice() {
	document.getElementById("tokenPriceInput").value = ""+sharedValues['price'];
}
function currentFuture() {
	document.getElementById("tokenPriceFutureInput").value = ""+sharedValues['price'];
}
linkButtons();
enterHomepage();

var abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalSupply",
				"type": "uint256"
			}
		],
		"name": "LogRebase",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			}
		],
		"name": "OwnershipRenounced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manualSync",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_flag",
				"type": "bool"
			}
		],
		"name": "setAutoAddLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_flag",
				"type": "bool"
			}
		],
		"name": "setAutoRebase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_botAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "_flag",
				"type": "bool"
			}
		],
		"name": "setBotBlacklist",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_autoLiquidityReceiver",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_treasuryReceiver",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_opInsuranceFundReceiver",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_thunderDome",
				"type": "address"
			}
		],
		"name": "setFeeReceivers",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setLP",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_pairAddress",
				"type": "address"
			}
		],
		"name": "setPairAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "_addr",
				"type": "address[]"
			}
		],
		"name": "setWhitelistMultiple",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "withdrawAllToTreasury",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "_autoAddLiquidity",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_autoRebase",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_initRebaseStartTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_lastAddLiquidityTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_lastRebasedTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner_",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "autoLiquidityReceiver",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "who",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "blacklist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "checkFeeExempt",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DECIMALS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeDenominator",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCirculatingSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "accuracy",
				"type": "uint256"
			}
		],
		"name": "getLiquidityBacking",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isNotInSwap",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "liquidityFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_UINT256",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "opInsuranceFundFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "opInsuranceFundReceiver",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pair",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pairAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pairContract",
		"outputs": [
			{
				"internalType": "contract IPancakeSwapPair",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "RATE_DECIMALS",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "router",
		"outputs": [
			{
				"internalType": "contract IPancakeSwapRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sellFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapEnabled",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "thunderDome",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "thunderDomeFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "treasuryFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "treasuryReceiver",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]