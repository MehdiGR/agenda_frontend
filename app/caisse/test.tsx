// "use client";
// import React, { useState } from "react";

// const TestC = () => {
//   const [focusedInput, setFocusedInput] = useState(null);
//   const [inputValues, setInputValues] = useState({
//     input1: "",
//     input2: "",
//     input3: "",
//   });

//   const handleFocus = (inputId) => {
//     setFocusedInput(inputId);
//   };

//   const handleButtonClick = (buttonValue) => {
//     console.log(buttonValue);
//     // Add the button value to the currently focused input
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [focusedInput]: prevValues[focusedInput] + buttonValue,
//     }));
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         id="input1"
//         placeholder="Input 1"
//         onFocus={() => handleFocus("input1")}
//         onChange={(e) =>
//           setInputValues({ ...inputValues, input1: e.target.value })
//         }
//         value={inputValues.input1}
//       />
//       <input
//         type="text"
//         id="input2"
//         placeholder="Input 2"
//         onFocus={() => handleFocus("input2")}
//         onChange={(e) =>
//           setInputValues({ ...inputValues, input2: e.target.value })
//         }
//         value={inputValues.input2}
//       />
//       <input
//         type="text"
//         id="input3"
//         placeholder="Input 3"
//         onFocus={() => handleFocus("input3")}
//         onChange={(e) =>
//           setInputValues({ ...inputValues, input3: e.target.value })
//         }
//         value={inputValues.input3}
//       />
//       <div className="grid grid-cols-3 gap-12">
//         {" "}
//         <button onClick={() => handleButtonClick("A")}> A</button>
//         <button onClick={() => handleButtonClick("B")}> B</button>
//         <button onClick={() => handleButtonClick("C")}> C</button>
//       </div>
//     </div>
//   );
// };

// export default TestC;
