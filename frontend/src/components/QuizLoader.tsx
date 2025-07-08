
const QuizLoader = () => {
  return (
    // <div
    //   className="fixed inset-0 z-50 bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
      // style={{ backgroundImage: "url('/static/images/thinking.jpg')" }}
    // >
    <div className="flex items-center justify-center h-screen overflow-hidden bg-black">
      <div className="backdrop-blur-xl bg-white shadow-2xl rounded-xl p-10 flex flex-col items-center justify-center space-y-4 w-full max-w-md">
        <div className="text-6xl animate-pulse">🧠</div>
        <h2 className="text-2xl font-semibold text-black">
          Generating Your Quiz
        </h2>
        <p className="text-sm text-black">
          Please wait while we prepare your questions...
        </p>
        <div className="bg-white rounded-full h-2 w-full overflow-hidden">
          <div className="bg-black h-full animate-[var(--animate-progress)]"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizLoader;
