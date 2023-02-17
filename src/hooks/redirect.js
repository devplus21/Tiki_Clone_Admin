import { useHistory } from "react-router-dom";

const useAuthorization = () => {
  const history = useHistory();

  const redirect = (path = "/") => {
    history.push(path);
  };

  return {
    redirect,
  };
};

export default useAuthorization;
