export function Calculator() {
  return (
    <div className="flex flex-wrap justify-center w-64">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "=", "X"].map((number) => (
        <button
          key={number}
          //   transition-colors
          className="border border-gray-400 w-16 h-16 flex items-center justify-center   duration-200 ease-in-out hover:bg-blue-500 hover:text-white"
        >
          {number}
        </button>
      ))}
    </div>
  );
}

export default Calculator;
