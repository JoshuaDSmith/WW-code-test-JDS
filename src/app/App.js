import React, { useState } from "react";
import { slice } from "../services/national-insurance";
import css from "./App.module.css";

function App() {
  const [input, setInput] = useState();
  const [display, setDisplay] = useState();
  const [taxContribution, settaxContribution] = useState();
  const [tax19Contribution, settax19Contribution] = useState();

  function tracker(e) {
    setInput(e.target.value);
  }

  function postHandler() {
    setDisplay(input);
  }

  function comparison2019() {
    //after requiring the slice function from the services folder, I have entered values that match those tested in the test.js file.
    const num = display;
    const floor = 702; //minimum taxable amount
    const ceiling = 3863; //maximum taxable amount before additional rate applies
    const rate = 0.88; // 12% progressive increase past minimum taxable amount
    const additionalRate = 0.02; //additional rate once ceiling has been met.
    const newValue = slice(floor, ceiling, num);

    const checker = newValue.d.shift(newValue.d);
    //if statements below to conditional render taxable amounts from whatever value the user enters:
    if (num <= 3863 && num > 702) {
      const valueIncrease = display * rate;
      console.log(valueIncrease);
      const newRate = num - valueIncrease + floor;
      settaxContribution(num - newRate);
      // the contribution amount value will now be progressive dependent on what the user enters in past ceiling amount
    } else if (num > 3863) {
      const value = display * rate;
      const newRate = num - value + floor;
      const additionalValue = newRate * additionalRate;
      const deductionValue = additionalValue + newRate;
      //simple deduction to show the user how much they take home once the deduction has been applied.
      settaxContribution(Math.floor(num - deductionValue));
    } else settaxContribution(checker);
    comparison2018();
  }

  function comparison2018() {
    const num = display;
    const floor = 702;
    const ceiling = 3863;
    const rate = 0.88; // 12% increase past ceiling
    const newValue = slice(floor, ceiling, num);
    const checker = newValue.d.shift(newValue.d);
    if (num <= 3863 && num > 702) {
      let value = display * rate;
      let newRate = num - value + floor;
      settax19Contribution(num - newRate);
      // the contribution amount value will now be progressive dependent on what the user enters in past ceiling amount
    } else if (num > 3863) {
      let value = display * rate;
      let newRate = num - value + floor;
      console.log(newRate);
      let contribution = Math.floor(num - newRate);

      settax19Contribution(Math.abs(contribution));
    } else settax19Contribution(checker);
  }

  return (
    <div className={css.container}>
      <section>
        <div>
          <h1> 2019 Income Tax Calculator</h1>
          <input onChange={tracker} value={input} type="number" />
          <button onClick={postHandler}> Submit </button>
          <p>Your Income: £{display}</p>
          <p>Tip: You must earn at least £703 per month to qualify for tax</p>

          <button onClick={comparison2019}>Calculate</button>

          <p>Take Home Pay: £{taxContribution} (rounded)</p>
        </div>
      </section>
      <section>
        <div>
          <h1> Compare with 2018 </h1>
          <p>
            Tip: You must earn at least £703 per month to qualify for tax
            Contribution
          </p>

          <p> Take Home Pay (2018)= £{tax19Contribution} (rounded)</p>
        </div>
      </section>
    </div>
  );
}

export default App;
