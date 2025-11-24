// Environment configuration helper
// Supports both build-time (import.meta.env) and runtime (window.__env__) variables

declare global {
  interface Window {
    __env__?: {
      VITE_THIRDWEB_CLIENT_ID?: string;
      VITE_AGREEMENT_CONTRACT?: string;
      VITE_API_BASE_URL?: string;
      VITE_API_URL?: string;
    };
  }
}

export const getEnv = () => {
  // Runtime env (production/Docker) takes precedence over build-time env (development)
  const runtimeEnv = window.__env__;

  return {
    THIRDWEB_CLIENT_ID:
      runtimeEnv?.VITE_THIRDWEB_CLIENT_ID ||
      import.meta.env.VITE_THIRDWEB_CLIENT_ID ||
      "",
    CONTRACT_ADDRESS:
      runtimeEnv?.VITE_AGREEMENT_CONTRACT ||
      import.meta.env.VITE_AGREEMENT_CONTRACT ||
      "",
    API_BASE_URL:
      runtimeEnv?.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:5000/api/v1",
    API_URL:
      runtimeEnv?.VITE_API_URL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api/v1",
  };
};
