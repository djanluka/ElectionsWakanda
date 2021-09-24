let web3;
let account;
let Elections;
let candidates;

const displayError = (msg) => {
  const error = $('#register-error-msg');
  error.css('opacity', '1');
  error.html(msg);
  error.show().delay(2500).fadeOut();
}

const displayWinners = (winners) => {
  const winningCandidates = document.getElementById('winning-candidates');
  
  winningCandidates.innerHTML = "<p><b>TOP THREE CANDIDATES:<b></p>";
  let ol = document.createElement("ol");
  
  for (let i=0; i<3; i++) {
    let li = document.createElement("li")
    li.innerText = (winners[i] > 0) ? candidates[winners[i]-1].name : '/';
    ol.appendChild(li);
  }
  
  winningCandidates.appendChild(ol);
  winningCandidates.style.opacity = 1;
  
  $('#winning-candidates').show().delay(5000).fadeOut();
}

const vote = async (candidateId, wknd) => {

  try {
    let w = await Elections.methods.vote(candidateId, wknd).send({from: account, gas: 200000});
    console.log('vote');
  } catch (err) {
    console.log(err.message);
    displayError("Voting problem");
  }
}

const voting = async () => {

  //Choose candidate and put number of tokens for voting
  $('#voting-button').on('click', async (event) => {
    event.preventDefault();

  	const candidateId = parseInt($('#candidates').val());
    const wknd = parseInt($('#wknd-field').val());
  	 
  	if (Number.isInteger(wknd)) vote(candidateId, wknd);
  	else displayError('Number of WKNDs problem');
  });

  //Show leads
  $('#winners-button').on('click', async (event) => {
    event.preventDefault();

    try {
      const winners = await Elections.methods.winningCandidates().call();
      displayWinners(winners);
    } catch(err) {
      displayError('Winning candidates problem');
    }
  });

  //Transfer one token to the other citizen
  $('#transfer-button').on('click', async (event) => {
    event.preventDefault();

    try {
      let add = $('#transfer-address-field').val();
      let w = await Elections.methods.transferWKNDBetweenVoters(add, 1).send({from: account, gas: 150000});
      console.log(w);
    } catch(err) {
      console.log(err);
      displayError('Transfer problem');
    }
  });

  //Get the number of tokens from the user
  $("#getwknd-button").on('click', async (event) => {
    event.preventDefault();

    try {
      const wknds = await Elections.methods.balance(account).call();
      console.log(wknds);
    } catch(err) {
      console.log(err);
      displayError('Getting WKNDs problem');
    }
  });

  //Catch newChallenger event and display changes
  Elections.events.newChallenger((err, event) => {
    const res = event.returnValues;
    displayWinners([res.firstPlace, res.secondPlace, res.thirdPlace]);
  });
  
}

const getCandidates = async() => {
  let response = await fetch('http://localhost:8082/candidates');
  candidates = await response.json();
  console.log(candidates);
}

const initWeb3 = async() => {
  web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  account = accounts[0];
  console.log(account);
  Elections = await getContract(web3);
}

const createSelectList = () => {
  const select = $('#candidates');
  for (let i=0; i<candidates.length; i++) {
      select.append(new Option(candidates[i].name, i+1));
  }
}

const initValues = async () => {
  await initWeb3();
  await getCandidates();
  createSelectList();
}

const isRegistred = async () => {
  try {
    const res = await Elections.methods.registredVoters(account).call();
    return res;
  } catch(err) {
    console.log('err');
    displayError('RegistredVoters problem');
  }
}

async function onLoad() {
  await initValues();

  const registred = await isRegistred();
  if (!registred) window.open('./../register.html', "_self");

  voting();
}

onLoad();