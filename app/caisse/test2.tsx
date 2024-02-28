// import React, { useState } from "react";

// const DynamicInputs = ({
//   numberOfInputs,
//   handleFocus,
//   handleChange,
//   inputValues,
// }) => {
//   const inputs = [];

//   for (let i = 1; i <= numberOfInputs; i++) {
//     const inputId = `input${i}`;
//     inputs.push(
//       <input
//         key={inputId}
//         type="text"
//         id={inputId}
//         placeholder={`Input ${i}`}
//         onFocus={() => handleFocus(inputId)}
//         onChange={(e) => handleChange(inputId, e.target.value)}
//         value={inputValues[inputId]}
//       />
//     );
//   }

//   return <>{inputs}</>;
// };

// const TestC = () => {
//   const [focusedInput, setFocusedInput] = useState(null);
//   const [inputValues, setInputValues] = useState({
//     input: "", // Use a single variable to handle all inputs
//   });

//   const handleFocus = (inputId) => {
//     setFocusedInput(inputId);
//   };

//   const handleChange = (inputId, value) => {
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [inputId]: value,
//     }));
//   };

//   const handleButtonClick = (buttonValue) => {
//     if (focusedInput) {
//       setInputValues((prevValues) => ({
//         ...prevValues,
//         [focusedInput]: prevValues[focusedInput] + buttonValue,
//       }));
//     }
//   };

//   return (
//     <div>
//       <DynamicInputs
//         numberOfInputs={3} // Change this number as needed
//         handleFocus={handleFocus}
//         handleChange={handleChange}
//         inputValues={inputValues}
//       />
//       <div className="grid grid-cols-3 gap-12">
//         <button onClick={() => handleButtonClick("A")}> A</button>
//         <button onClick={() => handleButtonClick("B")}> B</button>
//         <button onClick={() => handleButtonClick("C")}> C</button>
//       </div>
//     </div>
//   );
// };

// export default TestC;
