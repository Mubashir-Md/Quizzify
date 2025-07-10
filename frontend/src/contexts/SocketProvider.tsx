import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  useState,
} from "react";

const SocketContext = createContext<{
  socket: WebSocket | null;
  latestMessage: MessageEvent | null;
  nickname: string | null;
  setNickname: (name: string)=>void;
}>({ socket: null, latestMessage: null, nickname: "", setNickname: ()=>{} });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState<MessageEvent | null>(null);
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    setWebsocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (message) => {
      setLatestMessage(message);
    };

    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.warn("⚠️ WebSocket closed");

    return () => ws.close();
  }, []);
  return (
    <SocketContext.Provider
      value={{ socket: websocket, latestMessage, nickname, setNickname }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
