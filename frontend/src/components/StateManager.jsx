import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Theme, Button, Modal, TextInput} from "@carbon/react";

const StateManager = ({
    renderLauncher: LauncherContent,
    children: ModalContent,
  }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        {!ModalContent || typeof document === 'undefined'
          ? null
          : ReactDOM.createPortal(
              <>
                <Theme theme="g90">
                  <ModalContent open={open} setOpen={setOpen} />
                </Theme>
              </>,
              document.body
            )}
        {LauncherContent && <LauncherContent open={open} setOpen={setOpen} />}
      </>
    );
  };

export default StateManager