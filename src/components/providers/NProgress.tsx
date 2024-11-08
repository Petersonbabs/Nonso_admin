import {AppProgressBar as ProgressBar} from "next-nprogress-bar"
import { ReactNode } from "react";

const Providers = ({ children }: {children: ReactNode}) => {
    return (
      <>
        {children}
        <ProgressBar
          height="4px"
          color="#F4523E"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </>
    );
  };
  
  export default Providers;