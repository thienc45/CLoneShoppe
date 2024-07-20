// import { createContext, useState } from "react";
// import { getAccessTokenFromLs, getProfileFromLs } from "src/utils/auth";
// import React from 'react';
// import { User } from "src/types/user.type";

// interface AppContextInterface {
//   isAuthenticated: boolean;
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
//   profile: User | null
//   setProfile: React.Dispatch<React.SetStateAction<User | null>>
// }

// // Sử dụng một hàm trống cho setIsAuthenticated để thỏa mãn kiểu dữ liệu
// const initialAppContext: AppContextInterface = {
//   isAuthenticated: Boolean(getAccessTokenFromLs()),
//   setIsAuthenticated: () => null, // Hàm trống
//   profile: getProfileFromLs(),
//   setProfile: () => null
// }

// // Tạo context với giá trị mặc định là initialAppContext
// export const AppContext = createContext<AppContextInterface>(initialAppContext);

// // AppProvider sử dụng useState để quản lý trạng thái isAuthenticated và setIsAuthenticated
// export const AppProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated);
//   const [profile, setProfile] = useState<User | null>(initialAppContext.profile);

//   return (
//     <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}>
//       {children}
//     </AppContext.Provider>
//   );
// }


import { createContext, useState } from "react";
import { getAccessTokenFromLs, getProfileFromLs } from "src/utils/auth";
import React from 'react';
import { User } from "src/types/user.type";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

// Sử dụng một hàm trống cho setIsAuthenticated để thỏa mãn kiểu dữ liệu
const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLs()),
  setIsAuthenticated: () => null, // Hàm trống
  profile: getProfileFromLs(),
  setProfile: () => null
}

// Tạo context với giá trị mặc định là initialAppContext
export const AppContext = createContext<AppContextInterface>(initialAppContext);

// AppProvider sử dụng useState để quản lý trạng thái isAuthenticated và setIsAuthenticated
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile);

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}>
      {children}
    </AppContext.Provider>
  );
}

