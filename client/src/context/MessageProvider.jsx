import { createContext, useState } from "react";

export const MessageContext = createContext(null);

const MessageProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [accessT, setAccessT] = useState(null);
  const [refreshT, setRefreshT] = useState(null);

  return (
    <MessageContext.Provider value={{ userData, setUserData }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
