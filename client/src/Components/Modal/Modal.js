import { React, useState, cloneElement } from "react";
import propTypes from "prop-types";
import {
  Modal as RimbleModal,
  Card,

  Button
} from "rimble-ui";

const Modal = ({
  children,
  trigger,
  showClose,
  style,
  onCloseTrigger,
  show,
  modalWidth
}) => {
  const [shown, toggleShown] = useState(show);

  const renderTrigger = () => {
    return cloneElement(trigger, {
      onClick: () => {
        toggleShown(true);
      }
    });
  };

  const closeModal = e => {
    toggleShown(false);
    onCloseTrigger();
  };

  return (
    <>
      {trigger && renderTrigger()}
      <RimbleModal isOpen={shown}>
        <Card
          mx={"auto"}
          my={"auto"}
          p={"25px"}
          width={modalWidth ? modalWidth : ["auto"]}
          minWidth={"340px"}
          maxWidth={"960px"}
          height={["100vh", "auto"]}
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            ...style
          }}
        >
          {showClose && (
            <Button.Text
              icononly
              icon={"Close"}
              color={"moon-gray"}
              position={"absolute"}
              top={0}
              right={0}
              mt={3}
              mr={3}
              onClick={closeModal}
            />
          )}
          {typeof children === "function"
            ? children(closeModal)
            : cloneElement(children, { closeModal })}
        </Card>
      </RimbleModal>
    </>
  );
};

Modal.propTypes = {
  children: propTypes.oneOfType([
    propTypes.element,
    propTypes.array,
    propTypes.object,
    propTypes.func
  ]).isRequired,
  trigger: propTypes.oneOfType([propTypes.element, propTypes.bool]),
  showClose: propTypes.bool,
  show: propTypes.bool,
  style: propTypes.object,
  onCloseTrigger: propTypes.func
};

Modal.defaultProps = {
  trigger: false,
  style: {},
  showClose: true,
  show: false,
  onCloseTrigger: () => {}
};

export default Modal;
