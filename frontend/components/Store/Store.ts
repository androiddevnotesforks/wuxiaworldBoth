import { useLayoutEffect } from "react";
import createContext from "zustand/context";
import create from "zustand";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import axios from "axios";
import { apiUrl } from "../utils/siteName";

let store;

const getDefaultInitialState = () => ({
  isAnimating: false,
  lastUpdate: 0,
  count: 0,
  siteName: process.env.NEXT_PUBLIC_SITE_NAME,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  userInfo: null,
  settings: { darkMode: true },
  fontSize: 21,
  darkMode: "dark",
  accessToken: parseCookies().accessToken,
  profile: {},
});
const zustandContext: any = createContext();
export const Provider = zustandContext.Provider;
// An example of how to get types
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const useStore = zustandContext.useStore;

export const initializeStore = (preloadedState = {}) => {
  return create((set, get) => ({
    ...getDefaultInitialState(),
    ...preloadedState,
    setIsAnimating: (isAnimating) => set(() => ({ isAnimating })),
    setAccessToken: (accessToken) => {
      set((state) => ({ accessToken }));
      setCookie(null, "accessToken", accessToken, { path: "/" });
    },
    setProfile: (profile) => {
      set(() => ({ profile }));
      set(() => ({ profile }));
      set(() => ({ settings: profile?.settings }));
    },
    axiosRun: () => {
      const cookies = parseCookies();
      const token = cookies?.accessToken;
      const darkMode = cookies?.darkMode;
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
      }

      if (darkMode !== "dark" && darkMode !== "light") {
        setCookie(null, "darkMode", "dark");
      }
    },
    logOut: () => {
      set(() => ({ accessToken: null }));
      destroyCookie(null, "accessToken", { path: "/" });
    },
    logIn: (accessToken) => {
      set(() => ({ accessToken }));
      setCookie(null, "accessToken", accessToken, { path: "/" });
    },
    profileUpdate: (profile) => {
      set(() => ({
        darkMode: profile?.settings?.darkMode === false ? "light" : "dark",
      }));
      set(() => ({ profile }));
      set(() => ({ fontSize: profile?.settings?.fontSize }));
      set(() => ({ settings: profile?.settings }));
      setCookie(
        null,
        "darkMode",
        profile?.settings?.darkMode === false ? "light" : "dark",
        { path: "/" }
      );
      setCookie(null, "fontSize", profile?.settings?.fontSize, { path: "/" });
    },
    setUserInfo: () => {
      const token = get().accessToken;
      axios.defaults.headers.common["Authorization"] = token
        ? `Token ${token}`
        : null;
      axios
        .get(`${apiUrl}/api/users/me/`)
        .then((response) => {
          const resp = response.data;
          set((state) => ({ userInfo: resp }));
          set((state) => ({ settings: resp.settings }));
          set((state) => ({
            darkMode: resp.settings.darkMode === false ? "light" : "dark",
          }));
          set((state) => ({ fontSize: resp.settings.fontSize }));
        })
        .catch((err) => {
          console.log(err);
          destroyCookie(null, "accessToken", { path: "/" });
        });
    },
    changeSettings: (params) => {
      const loggedIn = get().accessToken;

      if (loggedIn) {
        axios
          .patch(`${apiUrl}/api/settings/me/`, params, {
            headers: { Authorization: `Token ${loggedIn}` },
          })
          .then((response) => {})
          .catch((err) => {
            console.log(err);
          });
      }

      if (params.darkMode != undefined) {
        set((state) => ({ darkMode: params.darkMode }));
        setCookie(null, "darkMode", params.darkMode, { path: "/" });
      } else if (params.fontSize) {
        set((state) => ({ fontSize: params.fontSize }));
        setCookie(null, "fontSize", params.fontSize, { path: "/" });
      }
    },
  }));
};

export function useCreateStore(serverInitialState) {
  if (typeof window === "undefined") {
    return () => initializeStore(serverInitialState);
  }

  // Client side code:
  // Next.js always re-uses same store regardless of whether page is a SSR or SSG or CSR type.
  const isReusingStore = Boolean(store);
  store = store ?? initializeStore(serverInitialState);
  // When next.js re-renders _app while re-using an older store, then replace current state with
  // the new state (in the next render cycle).
  // (Why next render cycle? Because react cannot re-render while a render is already in progress.
  // i.e. we cannot do a setState() as that will initiate a re-render)
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment (i.e. client or server)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    // serverInitialState is undefined for CSR pages. It is up to you if you want to reset
    // states on CSR page navigation or not. I have chosen not to, but if you choose to,
    // then add `serverInitialState = getDefaultInitialState()` here.
    if (serverInitialState && isReusingStore) {
      store.setState(
        {
          // re-use functions from existing store
          ...store.getState(),
          // but reset all other properties.
          ...serverInitialState,
        },
        true // replace states, rather than shallow merging
      );
    }
  });

  return () => store;
}
