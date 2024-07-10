import "./App.css";
import { useEffect, useState } from "react";
import React from "react";
import moment from "moment/moment";

function App() {
  //states
  const [name, setName] = useState("");
  const [datetime, setDateTime] = useState("");
  const [description, setDescription] = useState("");

  const [transactions, setTransactions] = useState("");

  //fetch data from mongo db to react app
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transactions";
    console.log(url);

    const price = name.split(" ")[0];

    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDateTime("");
        setDescription("");
        console.log("result", json);
      });
    });
  }

  let balance = 0;
  // const formattedDate ='';
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];

  return (
    <main>
      <h1 className={"price " + (balance < 0 ? "redd" : "greenn")}>
        ₹ {balance}
        <span>{fraction}</span>
      </h1>

      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"price and item name"}
          />
          <input
            value={datetime}
            onChange={(ev) => setDateTime(ev.target.value)}
            type="datetime-local"
          />
        </div>

        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder={"description"}
          />
        </div>

        <button type="submit" className="btn">
          Add new transaction
        </button>
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  ₹ {transaction.price}
                </div>
                <div className="datetime">
                  {moment(transaction.datetime).utc().format("DD MMM hh:mm")}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
