import { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import {
  Button,
  TextInput,
  PasswordInput,
  Container,
  Card,
} from "@mantine/core";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LoginIcon from "@mui/icons-material/Login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import ReactGA from "react-ga4";
import Background from "../../../components/Background/Background";
import { useRouter } from "next/router";
import { routes } from "../../../components/utils/Routes";
import { apiUrl } from "../../../components/utils/siteName";
import { useStore } from "../../../components/Store/Store";

// const clientId =
//   "778632375770-0ndavp1ba39q5qkj20bukf5ankbjs5gn.apps.googleusercontent.com";
const clientId =
  "553916859630-3ukm9ntg00ftpbqciu77h4ed41nh0vgi.apps.googleusercontent.com";

const Login = () => {
  const token = useStore((state) => state.accessToken);
  const logIn = useStore((state) => state.setAccessToken);
  const setUserInfo = useStore((state) => state.setUserInfo);
  const localhost = useStore((state) => state.local_host);
  const fbAppId = localhost ? "586157695796467" : "298089388720155";
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      axios.defaults.headers.common["Authorization"] = null;
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      router.push(`${routes.home}`);
    }
  }, []);

  const googleResponse = (response) => {
    let accesstoken = response.accessToken;
    googleLogin(accesstoken);
  };

  const facebookResponse = (response) => {
    let accesstoken = response.accessToken;
    facebookLogin(accesstoken);
  };
  const googleLogin = (accesstoken) => {
    axios
      .post(`${apiUrl}/rest-auth/google/`, {
        headers: { "Access-Control-Allow-Origin": "*" },
        access_token: accesstoken,
      })
      .then((response) => {
        let token = response.data.key;
        logIn(token);
        setUserInfo(token);
        ReactGA.event({
          category: `User Login`,
          action: `Google Login`,
          label: `Successful`,
        });
        router.back();
      })
      .catch((err) => {
        console.log(err);
        ReactGA.event({
          category: `User Login`,
          action: `Google Login`,
          label: `Unsucessful`,
        });
      });
  };

  const facebookLogin = (accesstoken) => {
    axios
      .post(`${apiUrl}/rest-auth/facebook/`, {
        access_token: accesstoken,
      })
      .then((response) => {
        let token = response.data.key;
        logIn(token);
        setUserInfo(token);
        ReactGA.event({
          category: `User Login`,
          action: `Facebook Login`,
          label: `Successful`,
        });
        history.back();
      })
      .catch((err) => {
        console.log(err);
        ReactGA.event({
          category: `User Login`,
          action: `Facebook Login`,
          label: `Unsuccessful`,
        });
      });
  };

  const normalLogin = () => {
    axios
      .post(`${apiUrl}/dj-rest-auth/login/`, {
        username: usernameValue,
        password: passwordValue,
      })
      .then((response) => {
        let token = response.data.key;
        logIn(token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Background>
      <Container size="xs" sx={{ padding: "20px" }}>
        <Card padding="lg" shadow="xl">
          <TextInput
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.currentTarget.value)}
            placeholder="Enter your username"
            label="Username"
            required
            sx={{ marginBottom: "20px" }}
          />
          <PasswordInput
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.currentTarget.value)}
            placeholder="Enter your password"
            label="Password"
            required
            sx={{ marginBottom: "20px" }}
          />
          <Button
            fullWidth
            leftIcon={<LoginIcon />}
            onClick={normalLogin}
            sx={{ marginBottom: "15px" }}
          >
            Login
          </Button>
          <GoogleLogin
            clientId={clientId}
            render={(renderProps) => (
              <Button
                color="gray"
                leftIcon={<GoogleIcon />}
                onClick={renderProps.onClick}
                fullWidth
                sx={{ marginBottom: "5px" }}
              >
                Login With Google
              </Button>
            )}
            onSuccess={googleResponse}
            onFailure={googleResponse}
          />
          <FacebookLogin
            appId={fbAppId}
            autoLoad={false}
            fields="name,email,picture"
            callback={facebookResponse}
            disableMobileRedirect={true}
            render={(renderProps) => (
              <Button
                leftIcon={<FacebookIcon />}
                color="rgb(66,103,178)"
                fullWidth
                onClick={renderProps.onClick}
              >
                Login With Facebook
              </Button>
            )}
          />
        </Card>
      </Container>
    </Background>
  );
};

export default Login;
