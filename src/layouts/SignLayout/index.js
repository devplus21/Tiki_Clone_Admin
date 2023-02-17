import { Route, Switch } from "react-router-dom";
import LoginPage from "../../pages/Login";
import "./style.scss";

const SignLayout = () => {
  return (
    <div id="sign__layout">
      <Switch>
        <Route path="/auth/login">
          <LoginPage />
        </Route>
      </Switch>
    </div>
  );
};

export default SignLayout;
