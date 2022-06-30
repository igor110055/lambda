import useSWR from "swr";

export const useAdminSupport = () => {
  const { data: support, mutate, error } = useSWR("/support");

  const loading = !support && !error;

  return { support, loading, error, mutate };
};
