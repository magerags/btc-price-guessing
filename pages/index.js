import Head from "next/head";
import styles from "../styles/Home.module.css";
import styled from "styled-components";
import { useEffect, useState } from "react";
import useStickyState from "../hooks/useStickyState";
import useInterval from "../hooks/useInterval";

// These variables are not included in rendering so they don't need to be React State
let guess;
let oldPrice;

export default function Home() {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [score, setScore] = useStickyState("score", 0);
  const [guessActive, setGuessActive] = useState(false);
  const [upActive, setUpActive] = useState(false);
  const [downActive, setDownActive] = useState(false);
  const [icon, setIcon] = useState();
  const [getPrice, setGetPrice] = useState(true);
  const [message, setMessage] = useState();

  async function getCurrentPrice() {
    const priceData = await fetch(
      "https://api.coinbase.com/v2/prices/spot?currency=GBP"
    ).then((res) => res.json());
    setCurrentPrice(priceData.data.amount);
  }

  // First mount current price
  useEffect(() => {
    getCurrentPrice();
  }, []);

  // Get price every second if there is no active guess or if guess is active but price has not changed
  useInterval(
    () => {
      getCurrentPrice();
    },
    getPrice ? 1000 : null
  );

  // Start countdown timer and stop at zero
  useInterval(
    () => {
      setCountdown((prevState) => prevState - 1);
    },
    guessActive && !countdown <= 0 ? 1000 : null
  );

  // Trigger score handler
  useEffect(() => {
    if (countdown === 0) {
      getCurrentPrice();
      if (oldPrice === currentPrice) {
        setGetPrice(true);
        setMessage("Waiting for price to change");
        setIcon("⏳");
      } else {
        setGetPrice(false);
        scorer();
      }
    }
  }, [countdown, currentPrice]);

  // Scoring logic, after 5 seconds reset game. Could refactor this for less repitition
  // but I like the simplicity and readability
  async function scorer() {
    if (oldPrice > currentPrice && guess === "down") {
      setScore((prevState) => prevState + 1);
      setIcon("✅");
      setMessage("Correct! Well done! 🎉");
    }
    if (oldPrice > currentPrice && guess === "up") {
      setScore((prevState) => prevState - 1);
      setIcon("❌");
      setMessage("Incorrect... try again?");
    }
    if (oldPrice < currentPrice && guess === "up") {
      setScore((prevState) => prevState + 1);
      setIcon("✅");
      setMessage("Correct! Well done! 🎉");
    }
    if (oldPrice < currentPrice && guess === "down") {
      setScore((prevState) => prevState - 1);
      setIcon("❌");
      setMessage("Incorrect... try again?");
    }
    setTimeout(reset, 5000);
  }

  // Reset values
  function reset() {
    setGetPrice(true);
    setGuessActive(false);
    setMessage("");
    setUpActive(false);
    setDownActive(false);
    setIcon(null);
    setCountdown(60);
    oldPrice = null;
  }

  function clickHandler(choice) {
    if (!guessActive) {
      choice === "up" ? setUpActive(true) : setDownActive(true);
      guess = choice;
      oldPrice = currentPrice;
    }
    setGuessActive(true);
    setGetPrice(false);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>BTC Guesser</title>
        <meta name="description" content="Coding challenge for ePilot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <h1 className={styles.title}>
          Welcome to <Highlight>BTC Guesser</Highlight>
        </h1>
        <Spacer />
        <Description>
          The aim of the game is to guess whether the price of Bitcoin will go
          up or down in the 60 seconds after the guess is made.
        </Description>
        <Description>
          You will get 1 point for a correct guess but lose 1 point for each
          incorrect guess.
        </Description>
        <Description>Good luck!</Description>
        <Spacer />

        <GameWrapper>
          <Description>Current Price</Description>
          <Price>£{currentPrice}</Price>
          <Message>{message}</Message>
          <Flex>
            <ArrowWrapper onClick={() => clickHandler("up")} active={upActive}>
              ↑
            </ArrowWrapper>
            <Countdown>
              {countdown > 0 && countdown}
              {icon}
            </Countdown>
            <ArrowWrapper
              onClick={() => clickHandler("down")}
              active={downActive}
            >
              ↓
            </ArrowWrapper>
          </Flex>
          <Score>
            Score: <Highlight>{score}</Highlight>
          </Score>
        </GameWrapper>
      </Main>
    </div>
  );
}

const Highlight = styled.span`
  color: #f7931a;
`;

const Main = styled.main`
  padding: 6rem 8rem;
`;

const Description = styled.p`
  text-align: center;
  line-height: 1.5;
  font-size: 1.5rem;
`;

const Spacer = styled.div`
  margin: 4rem 0rem;
`;

const GameWrapper = styled.section`
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Price = styled.h2`
  color: #f7931a;
  font-size: 2rem;
  margin-top: -1rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const ArrowWrapper = styled.div`
  font-size: 3rem;
  padding: 2rem 2.5rem;
  background-color: ${(props) =>
    props.active ? "#f7931a!important" : "white"};
  border-radius: 8px;
  margin: 1.5rem 3rem;
  transition: all 0.5s cubic-bezier(0, 0, 0.5, 1);

  :hover {
    cursor: pointer;
    background-color: #f8d2a3;
  }
`;

const Countdown = styled.p`
  font-weight: 600;
  font-size: 1.5rem;
  display: block;
  width: 50px;
  text-align: center;
`;

const Score = styled.h2`
  font-size: 2rem;
`;

const Message = styled.p`
  display: block;
  height: 30px;
  margin: 0;
  font-weight: 600;
  font-size: 1.2rem;
`;
