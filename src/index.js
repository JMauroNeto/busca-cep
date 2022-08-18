import "./styles.css";

const fetchAddress = async (cep) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

  return response.json();
};

const addAddressToTable = (address) => {
  const tbody = document.getElementById("enderecos-tbody");
  const row = document.createElement("tr");

  Object.keys(address).forEach((key) => {
    const column = document.createElement("td");
    column.innerText = address[key];
    row.appendChild(column);
  });

  tbody.appendChild(row);
};

const clearAddresses = () => {
  const tbody = document.getElementById("enderecos-tbody");
  tbody.innerHTML = "";

  localStorage.removeItem("addresses");
  showStartText();
};

const retrieveAddressesFromLocalStorage = () => {
  const addresses = localStorage.getItem("addresses");

  return addresses ? JSON.parse(addresses) : [];
};

const addAddressToLocalStorage = (address) => {
  const addresses = retrieveAddressesFromLocalStorage();
  localStorage.setItem("addresses", JSON.stringify([...addresses, address]));
};

const formatAddress = (rawAddress) => {
  return {
    cep: rawAddress.cep,
    street: rawAddress.logradouro,
    district: rawAddress.bairro,
    cityState: `${rawAddress.localidade}/${rawAddress.uf}`
  };
};

const handleAddress = async (cep) => {
  const address = await fetchAddress(cep);
  const formattedAddress = formatAddress(address);
  addAddressToTable(formattedAddress);
  addAddressToLocalStorage(formattedAddress);
};

const handleCep = async () => {
  const input = document.getElementById("cep");
  const cep = input.value;

  if (cep) {
    await handleAddress(cep);
  }
};

const clearInput = () => {
  const input = document.getElementById("cep");
  input.value = "";
};

const hideStartText = () => {
  const startText = document.getElementById("start-wrapper");
  startText.style.display = "none";
};

const showStartText = () => {
  const startText = document.getElementById("start-wrapper");
  startText.style.display = "block";
};

const submitForm = async (event) => {
  event.preventDefault();
  await handleCep();
  clearInput();
  hideStartText();
};

const renderStoredAddresses = () => {
  const addresses = retrieveAddressesFromLocalStorage();

  addresses.forEach(addAddressToTable);
};

const init = () => {
  const form = document.getElementById("form-cep");
  form.addEventListener("submit", submitForm);

  const clearButton = document.getElementById("btn-clean");
  clearButton.addEventListener("click", clearAddresses);

  renderStoredAddresses();
};

init();
