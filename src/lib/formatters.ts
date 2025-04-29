export const convertMinutes = (runtimeInMinutes: number) => {
  const hours = Math.floor(runtimeInMinutes / 60);
  const minutes = runtimeInMinutes % 60;

  let runtime: string = "";

  if (hours === 1) {
    runtime = `${hours} hr ${minutes} mins`;
  } else if (hours > 1) {
    runtime = `${hours} hrs ${minutes} mins`;
  } else {
    runtime = `${minutes} mins`;
  }

  return runtime;
};
