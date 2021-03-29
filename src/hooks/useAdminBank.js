import useSWR from "swr";

export const useAdminBank = () => {
  const { data: bank, mutate, error } = useSWR("/bank");

  const loading = !bank && !error;

  return { bank, loading, error, mutate };
};
