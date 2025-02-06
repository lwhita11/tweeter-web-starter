import { useState } from "react";

interface Props {
    handleAuth: () => void;
    alias: string;
    setAlias: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
}


const AuthenticationFields = (props: Props) => {


    const handleEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
          props.handleAuth();
        }
      };

      const checkSubmitButtonStatus = (): boolean => {
        return !props.alias || !props.password;
      };

    return (
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={handleEnter}
            onChange={(event) => props.setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={handleEnter}
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    )
}

export default AuthenticationFields;