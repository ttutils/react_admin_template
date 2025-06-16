import { getUsername } from "@/src/utils/auth";

const Home = () => {
  return (
    <>
      <h1 className="m-5">hello, {getUsername()}</h1>
    </>
  );
};

export default Home;