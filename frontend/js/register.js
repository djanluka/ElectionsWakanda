let web3;
let account;
let Elections;
let registerButton;

const displayError = (msg) => {
  const error = $('#register-error-msg');
  error.css('opacity', '1');
  error.html(msg)
  error.show().delay(2500).fadeOut();
}

const register = async () => {
  try {
    let w = await Elections.methods.register().send({from: account, gas: 150000});
    window.open('./../voting.html', "_self");
  } catch (err) {
    console.log(err.message);
    displayError("Register problem");
  }
};

const registration = async () => {

  $('#register-button').on('click', async (event) => {
    event.preventDefault();

    const ethAddress = $('#address-field').val();
    if (ethAddress === account) {
      register();
    } else {
      displayError("Address is not valid");
    }
  });
  
}

const initWeb3 = async() => {
  web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  account = accounts[0];
  console.log(account);
  Elections = await getContract(web3);
}

const isRegistred = async () => {
  try {
    const res = await Elections.methods.registredVoters(account).call();
    return res;
  } catch(err) {
    console.log(err);
    displayError('RegistredVoters problem');
    return false;
  }
}

async function onLoad() {
  await initWeb3();

  const registred = await isRegistred();
  if (registred) window.open('./../voting.html', "_self");

  registration();  
}

onLoad();