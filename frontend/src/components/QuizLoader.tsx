// components/QuizLoader.tsx
const QuizLoader = () => {
  return (
    <div
      className="fixed inset-0 z-50 bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
      // style={{ backgroundImage: "url('/static/images/thinking.jpg')" }}
    >
      <div className="backdrop-blur-xl bg-white/30 shadow-2xl rounded-xl p-10 flex flex-col items-center justify-center space-y-4 w-full max-w-md">
        <div className="text-6xl animate-pulse">🧠</div>
        <h2 className="text-2xl font-semibold text-black">
          Generating Your Quiz
        </h2>
        <p className="text-sm text-black/80">
          Please wait while we prepare your questions...
        </p>
        <div className="bg-gray-300 rounded-full h-2 overflow-hidden">
          <div className="bg-black h-full animate-[var(--animate-progress)]"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizLoader;
